package com.farm.farmtrade.dto.request.voucherRequest;

import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoucherCreationRequest {
    @Column(unique = true, nullable = false, length = 50)
    String code;
    String description;
    String discountType; // 'AMOUNT' hoặc 'PERCENT'

    @Column(precision = 10, scale = 2)
    BigDecimal discountValue;

    @Column(precision = 12, scale = 2)
    BigDecimal minOrderAmount = BigDecimal.ZERO;

    Integer requiredPoints;
    Integer maxUsage = 1;
    LocalDateTime expirationDate;
}
