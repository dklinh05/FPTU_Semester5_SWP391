package com.farm.farmtrade.dto.request.withdraw;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WithdrawRequestDTO {
    private Integer supplierId;
    private BigDecimal amountRequested;
    private String bankName;
    private String bankAccountNumber;
}

