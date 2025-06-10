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
    VoucherRepository voucherRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    OrderItemRepository orderItemRepository;

    //Tạo đơn hàng mới.
    @Transactional
    public Order createOrder(OrderCreationRequest request) {
        User buyer = userRepository.findById(request.getBuyerId())
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found with ID: " + request.getBuyerId()));

        if (!buyer.getRole().equalsIgnoreCase("CUSTOMER")) {
            throw new IllegalArgumentException("User with ID " + buyer.getUserID() + " is not a CUSTOMER");
        }
        Voucher voucher = null;
        if (request.getVoucherId() != null) {
            voucher = voucherRepository.findById(request.getVoucherId())
                    .orElseThrow(() -> new IllegalArgumentException("Voucher not found with ID: " + request.getVoucherId()));

            // Validate: Expired
            if (voucher.getExpirationDate() != null && voucher.getExpirationDate().isBefore(request.getOrderDate())) {
                throw new IllegalArgumentException("Voucher has expired");
            }
            //  Validate: Required Points
            if (voucher.getRequiredPoints() != null &&
                    voucher.getRequiredPoints() > 0 &&
                    (buyer.getRewardPoints() == null || buyer.getRewardPoints() < voucher.getRequiredPoints())) {
                throw new IllegalArgumentException("Insufficient reward points to use this voucher");
            }

            // Validate: Max Usage (chỉ đơn giản đếm số đơn đã dùng voucher này)
            long usedCount = orderRepository.countByVoucher(voucher);
            if (voucher.getMaxUsage() != null && usedCount >= voucher.getMaxUsage()) {
                throw new IllegalArgumentException("This voucher has reached its maximum usage limit");
            }
        }

        Order order = Order.builder()
                .buyer(buyer)
                .orderDate(LocalDateTime.now())
                .status(request.getStatus())
                .totalAmount(BigDecimal.ZERO)
                .voucher(voucher)
                .build();
        order = orderRepository.save(order); // có orderID

        // Tạo OrderItems
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            BigDecimal unitPrice = product.getPrice();

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .price(unitPrice)
                    .build();
            orderItemRepository.save(item);

            // tính tổng
            totalAmount = totalAmount.add(
                    unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()))
            );
        }
        // Trừ điểm nếu dùng voucher
        if (voucher != null && voucher.getRequiredPoints() != null && voucher.getRequiredPoints() > 0) {
            buyer.setRewardPoints(buyer.getRewardPoints() - voucher.getRequiredPoints());
            userRepository.save(buyer);
        }
        // 3. Cập nhật lại totalAmount cho Order
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
}
