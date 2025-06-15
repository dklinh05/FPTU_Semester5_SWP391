package com.farm.farmtrade.service.order;

import com.farm.farmtrade.dto.request.orderRequest.OrderCreationRequest;
import com.farm.farmtrade.dto.request.orderRequest.OrderItemRequest;
import com.farm.farmtrade.entity.*;
import com.farm.farmtrade.repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService {
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserVoucherRepository userVoucherRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    OrderItemRepository orderItemRepository;
    @Autowired
    VoucherRepository voucherRepository;

    //tạo đơn hàng mới
    @Transactional
    public Order createOrder(OrderCreationRequest request) {
        User buyer = userRepository.findById(request.getBuyerId())
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found with ID: " + request.getBuyerId()));

//        UserVoucher userVoucher = null;
//        Voucher voucher = null;
//        if (request.getUserVoucherId() != null) {
//            userVoucher = userVoucherRepository.findById(request.getUserVoucherId())
//                    .orElseThrow(() -> new IllegalArgumentException("UserVoucher not found with ID: " + request.getUserVoucherId()));
//            if (userVoucher.getIsUsed()) {
//                throw new IllegalArgumentException("Voucher has already been used");
//            }
//            if (!userVoucher.getUser().getUserID().equals(request.getBuyerId())) {
//                throw new IllegalArgumentException("This voucher does not belong to the buyer");
//            }
//            voucher = userVoucher.getVoucher();
//            if (voucher.getExpirationDate() != null && voucher.getExpirationDate().isBefore(LocalDateTime.now())) {
//                throw new IllegalArgumentException("Voucher has expired");
//            }
//            if (voucher.getMaxUsage() != null && voucher.getMaxUsage() == 0) {
//                throw new IllegalArgumentException("This voucher has reached its maximum number of uses");
//            }
//        }

        Order order = Order.builder()
                .buyer(buyer)
                .orderDate(LocalDateTime.now())
                .status(request.getStatus())
                .totalAmount(BigDecimal.ZERO)
                .build();

        order = orderRepository.save(order); // tạo order trước để có ID

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + itemReq.getProductId()));

            int orderedQuantity = itemReq.getQuantity();

            // Kiểm tra tồn kho
            if (product.getStockQuantity() == null || product.getStockQuantity() < orderedQuantity) {
                throw new IllegalArgumentException("Not enough stock for product: " + product.getName());
            }

            BigDecimal unitPrice = product.getPrice();

            // Tạo OrderItem
            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(orderedQuantity)
                    .price(unitPrice)
                    .build();
            orderItemRepository.save(item);

            // Trừ tồn kho
            product.setStockQuantity(product.getStockQuantity() - orderedQuantity);
            productRepository.save(product);

            // Cộng tổng tiền
            totalAmount = totalAmount.add(unitPrice.multiply(BigDecimal.valueOf(orderedQuantity)));
        }

//        // Áp dụng giảm giá nếu có
//        BigDecimal discountAmount = BigDecimal.ZERO;
//        if (voucher != null) {
//            // Check min order
//            if (voucher.getMinOrderAmount() != null && totalAmount.compareTo(voucher.getMinOrderAmount()) < 0) {
//                throw new IllegalArgumentException("Order amount does not meet the minimum for this voucher");
//            }
//
//            if ("PERCENT".equalsIgnoreCase(voucher.getDiscountType())) {
//                discountAmount = totalAmount.multiply(voucher.getDiscountValue())
//                        .divide(BigDecimal.valueOf(100));
//            } else if ("AMOUNT".equalsIgnoreCase(voucher.getDiscountType())) {
//                discountAmount = voucher.getDiscountValue();
//            }
//
//            // Không để giảm vượt tổng tiền
//            if (discountAmount.compareTo(totalAmount) > 0) {
//                discountAmount = totalAmount;
//            }
//
//            // Đánh dấu đã dùng
//            userVoucher.setIsUsed(true);
//            userVoucherRepository.save(userVoucher);
//            // Giảm MaxUsage trong bảng Voucher (nếu đang > 0)
//            if (voucher.getMaxUsage() != null && voucher.getMaxUsage() > 0) {
//                voucher.setMaxUsage(voucher.getMaxUsage() - 1);
//                voucherRepository.save(voucher);
//            }
//        }

        // Lưu lại các giá trị
//        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(totalAmount);
        return orderRepository.save(order);
    }


    //Lấy danh sách tất cả đơn hàng.
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    //Lấy đơn hàng theo ID.
    public Order getOrderById(Integer id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + id));
    }

    // Xóa đơn hàng theo ID.
    public void deleteOrder(Integer id) {
        if (!orderRepository.existsById(id)) {
            throw new IllegalArgumentException("Order not found with ID: " + id);
        }
        orderRepository.deleteById(id);
    }

    // tìm order theo buyerID
    public List<Order> getOrdersByBuyerId(Integer buyerId) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found with ID: " + buyerId));

        return orderRepository.findByBuyer(buyer);
    }

//    // tìm order theo shipperID
//    public List<Order> getOrdersByShipperId(Integer shipperId) {
//        User shipper = userRepository.findById(shipperId)
//                .orElseThrow(() -> new IllegalArgumentException("Shipper not found with ID: " + shipperId));
//
//        return orderRepository.findByShipper(shipper);
//    }

    public List<OrderItem> getOrderItemsByOrderId(Integer orderId) {
        return orderItemRepository.findByOrderOrderID(orderId);
    }

}
