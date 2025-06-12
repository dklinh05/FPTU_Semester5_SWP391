package com.farm.farmtrade.dto.request.voucherRequest;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RedeemVoucherRequest {
    String userId;
    String voucherId;
}
