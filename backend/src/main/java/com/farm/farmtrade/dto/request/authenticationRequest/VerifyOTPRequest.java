package com.farm.farmtrade.dto.request.authenticationRequest;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VerifyOTPRequest {
    String email;
    String otp;
    String newPassword;
}