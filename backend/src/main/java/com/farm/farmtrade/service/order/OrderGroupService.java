package com.farm.farmtrade.service.order;

import com.farm.farmtrade.dto.request.orderRequest.OrderCreationRequest;
import com.farm.farmtrade.dto.request.orderRequest.OrderGroupRequest;
import com.farm.farmtrade.dto.request.orderRequest.OrderItemRequest;
import com.farm.farmtrade.entity.*;
import com.farm.farmtrade.repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderGroupService {
    UserRepository userRepository;
    ProductRepository productRepository;
    OrderGroupRepository orderGroupRepository;
    OrderRepository orderRepository;
    OrderItemRepository orderItemRepository;
    UserVoucherRepository userVoucherRepository;
    VoucherRepository voucherRepository;

    @Transactional
    public OrderGroup createOrderGroup(OrderGroupRequest request) {
        User buyer = userRepository.findById(request.getBuyerId())
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found with ID: " + request.getBuyerId()));

        UserVoucher userVoucher = null;
        Voucher voucher = null;
        if (request.getUserVoucherId() != null) {
            userVoucher = userVoucherRepository.findById(request.getUserVoucherId())
                    .orElseThrow(() -> new IllegalArgumentException("UserVoucher not found with ID: " + request.getUserVoucherId()));
            if (userVoucher.getIsUsed()) {
                throw new IllegalArgumentException("Voucher has already been used");
            }
            if (!userVoucher.getUser().getUserID().equals(request.getBuyerId())) {
                throw new IllegalArgumentException("This voucher does not belong to the buyer");
            }
            voucher = userVoucher.getVoucher();
            if (voucher.getExpirationDate() != null && voucher.getExpirationDate().isBefore(LocalDateTime.now())) {
                throw new IllegalArgumentException("Voucher has expired");
            }
            if (voucher.getMaxUsage() != null && voucher.getMaxUsage() == 0) {
                throw new IllegalArgumentException("This voucher has reached its maximum number of uses");
            }
        }

        OrderGroup orderGroup = OrderGroup.builder()
                .buyer(buyer)
                .userVoucher(userVoucher)
                .totalAmount(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .finalAmount(BigDecimal.ZERO)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();
        orderGroup = orderGroupRepository.save(orderGroup);

        BigDecimal groupTotal = BigDecimal.ZERO;

        for (OrderCreationRequest orderReq : request.getOrders()) {
            User supplier = userRepository.findById(orderReq.getSupplierId())
                    .orElseThrow(() -> new IllegalArgumentException("Supplier not found with ID: " + request.getBuyerId()));
            Order order = Order.builder()
                    .buyer(buyer)
                    .supplier(supplier)
                    .status(orderReq.getStatus())
                    .orderDate(LocalDateTime.now())
                    .totalAmount(BigDecimal.ZERO)
                    .orderGroup(orderGroup)
                    .build();
            order = orderRepository.save(order);

            BigDecimal orderTotal = BigDecimal.ZERO;
            for (OrderItemRequest itemReq : orderReq.getItems()) {
                Product product = productRepository.findById(itemReq.getProductId())
                        .orElseThrow(() -> new IllegalArgumentException("Product not found"));
                BigDecimal price = product.getPrice();

                OrderItem item = OrderItem.builder()
                        .order(order)
                        .product(product)
                        .quantity(itemReq.getQuantity())
                        .price(price)
                        .build();
                orderItemRepository.save(item);

                // Update stock
                product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
                // Update sales
                product.setSales(product.getSales() + itemReq.getQuantity());
                productRepository.save(product);

                orderTotal = orderTotal.add(price.multiply(BigDecimal.valueOf(itemReq.getQuantity())));
            }
            order.setTotalAmount(orderTotal);
            orderRepository.save(order);
            groupTotal = groupTotal.add(orderTotal);
        }

        // Apply discount
        BigDecimal discount = BigDecimal.ZERO;
        if (voucher != null) {
            if (voucher.getMinOrderAmount() != null && groupTotal.compareTo(voucher.getMinOrderAmount()) < 0)
                throw new IllegalArgumentException("Order amount doesn't meet voucher minimum requirement");

            if ("PERCENT".equalsIgnoreCase(voucher.getDiscountType())) {
                discount = groupTotal.multiply(voucher.getDiscountValue()).divide(BigDecimal.valueOf(100));
            } else if ("AMOUNT".equalsIgnoreCase(voucher.getDiscountType())) {
                discount = voucher.getDiscountValue();
            }
            if (discount.compareTo(groupTotal) > 0) discount = groupTotal;

            userVoucher.setIsUsed(true);
            userVoucherRepository.save(userVoucher);
            if (voucher.getMaxUsage() != null && voucher.getMaxUsage() > 0) {
                voucher.setMaxUsage(voucher.getMaxUsage() - 1);
                voucherRepository.save(voucher);
            }
        }

        orderGroup.setTotalAmount(groupTotal);
        orderGroup.setDiscountAmount(discount);
        orderGroup.setFinalAmount(groupTotal.subtract(discount));

        return orderGroupRepository.save(orderGroup);
    }

    public List<OrderGroup> getAllOrderGroups() {
        return orderGroupRepository.findAll();
    }

    public OrderGroup getOrderGroupById(String id) {
        return orderGroupRepository.findById(Integer.valueOf(id))
                .orElseThrow(() -> new IllegalArgumentException("OrderGroup not found with ID: " + id));
    }
}
