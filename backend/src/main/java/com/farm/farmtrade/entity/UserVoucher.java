package com.farm.farmtrade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "UserVouchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserVoucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userVoucherID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "voucherID", nullable = false)
    private Voucher voucher;

    private Boolean isUsed = false;

    private LocalDateTime redeemedAt = LocalDateTime.now();
}