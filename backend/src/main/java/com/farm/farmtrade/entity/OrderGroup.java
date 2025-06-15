package com.farm.farmtrade.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "OrderGroups")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer orderGroupID;

    @ManyToOne
    @JoinColumn(name = "BuyerID")
    User buyer;
    BigDecimal totalAmount;
    BigDecimal discountAmount;
    BigDecimal finalAmount;
    String status;
    LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "orderGroup")
    List<Order> orders;
    @ManyToOne
    @JoinColumn(name = "userVoucherID")
    UserVoucher userVoucher;
}

