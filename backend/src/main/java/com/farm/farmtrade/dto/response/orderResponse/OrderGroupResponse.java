package com.farm.farmtrade.dto.response.orderResponse;

import com.farm.farmtrade.entity.Order;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class OrderGroupResponse {

        Integer orderGroupID;
        Integer buyerId;
        BigDecimal totalAmount;
        BigDecimal discountAmount;
        BigDecimal finalAmount;
        String status;
        LocalDateTime createdAt = LocalDateTime.now();
        List<OrderResponse> orders;
        Integer userVoucherId;
}
