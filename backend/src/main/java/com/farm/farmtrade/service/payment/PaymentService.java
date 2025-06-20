package com.farm.farmtrade.service.payment;

import com.farm.farmtrade.entity.Order;
import com.farm.farmtrade.entity.OrderGroup;
import com.farm.farmtrade.entity.OrderItem;
import com.farm.farmtrade.entity.Payment;
import com.farm.farmtrade.repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentService {

    PaymentRepository paymentRepository;
    OrderRepository orderRepository;
    OrderGroupRepository orderGroupRepository;

    @Transactional
    public void savePayment(Integer orderGroupId) {
        OrderGroup orderGroup = orderGroupRepository.findById(orderGroupId)
                .orElseThrow(() -> new IllegalArgumentException("OrderGroup not found with ID: " + orderGroupId));
        if (orderGroup.getOrders() == null || orderGroup.getOrders().isEmpty()) {
            throw new IllegalStateException("Order group has no orders.");
        }

        // Cập nhật trạng thái cho toàn bộ order trong group
        for (Order order : orderGroup.getOrders()) {
            order.setStatus("PAID");
            orderRepository.save(order);
            Payment payment = Payment.builder()
                    .order(order)
                    .method("PAYPAL")
                    .amount(order.getTotalAmount())
                    .status("COMPLETED")
                    .paymentDate(LocalDateTime.now())
                    .build();
            paymentRepository.save(payment);

        }

        // Cập nhật trạng thái nhóm đơn hàng
        orderGroup.setStatus("PAID");
        orderGroupRepository.save(orderGroup);

    }

}

