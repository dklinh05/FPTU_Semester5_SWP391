package com.farm.farmtrade.dto.response.orderResponse;

import com.farm.farmtrade.entity.Order;
import com.farm.farmtrade.entity.OrderGroup;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.entity.UserVoucher;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    Integer orderID;
    Integer buyerId;
    Integer supplierId;
    LocalDateTime orderDate;
    String status;
    BigDecimal totalAmount;
    Integer orderGroupId;
}
