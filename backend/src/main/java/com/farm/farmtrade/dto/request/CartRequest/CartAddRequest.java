package com.farm.farmtrade.dto.request.CartRequest;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartAddRequest {
    Integer buyerId;
    Integer productId;
    Integer quantity;
}
