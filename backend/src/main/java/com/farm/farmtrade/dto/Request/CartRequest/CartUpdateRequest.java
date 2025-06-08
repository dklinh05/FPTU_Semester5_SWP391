package com.farm.farmtrade.dto.Request.CartRequest;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartUpdateRequest {
    private Integer cartItemId;
    private Integer quantity;
}
