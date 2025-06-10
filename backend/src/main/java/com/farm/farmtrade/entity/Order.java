package com.farm.farmtrade.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Orders")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer orderID;

    @ManyToOne
    @JoinColumn(name = "BuyerID")
    User buyer;

    LocalDateTime orderDate;
    String status;
    BigDecimal totalAmount;

    @ManyToOne
    @JoinColumn(name = "VoucherID")
    Voucher voucher;
}

