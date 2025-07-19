package com.farm.farmtrade.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "withdraw_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WithdrawRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "SupplierID")
    User supplier;

    @Column(nullable = false)
    BigDecimal amountRequested; // Số tiền yêu cầu rút

    BigDecimal platformFee;     // 10% phí nền tảng

    BigDecimal amountApproved;  // Số tiền thực tế được chuyển cho supplier (90%)

    String status; // PENDING, APPROVED, REJECTED

    LocalDateTime requestDate;
    LocalDateTime processedDate;
    String bankName;
    String bankAccountNumber;
    String note;
}

