package com.farm.farmtrade.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    private Integer orderID;
    private Integer buyerId;
    private Integer supplierId;
    private LocalDateTime orderDate;
    private String status;
    private BigDecimal totalAmount;
}
