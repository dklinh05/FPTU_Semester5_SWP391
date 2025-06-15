package com.farm.farmtrade.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemResponse {
    private Integer orderItemID;
    private Integer quantity;
    private BigDecimal price;
    private Integer productId;
    private String productName;
    private String productImage;
}
