package com.farm.farmtrade.entity;

import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Table(name = "Vouchers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer voucherID;

    @Column(unique = true, nullable = false, length = 50)
    private String code;
    private String description;
    private String discountType; // 'AMOUNT' hoặc 'PERCENT'

    @Column(precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(precision = 12, scale = 2)
    private BigDecimal minOrderAmount = BigDecimal.ZERO;

    private Integer requiredPoints;
    private Integer maxUsage = 1;
    private LocalDateTime expirationDate;
    private LocalDateTime createdAt = LocalDateTime.now();
}
