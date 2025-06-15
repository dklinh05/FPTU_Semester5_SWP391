package com.farm.farmtrade.dto.response.orderResponse;

import com.farm.farmtrade.entity.Order;
import com.farm.farmtrade.entity.Product;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemResponse {

    Integer orderItemID;
    Integer orderId;
    Integer productId;
    Integer quantity;
    BigDecimal price;
}
