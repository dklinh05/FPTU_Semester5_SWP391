package com.farm.farmtrade.dto.request.shipping;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShippingFeeRequest {
    private Double latitude;      // Vị trí của người mua
    private Double longitude;
    private Long supplierId;
}
