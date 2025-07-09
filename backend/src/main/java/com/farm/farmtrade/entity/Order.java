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
    @ManyToOne
    @JoinColumn(name = "SupplierID")
    User supplier;
    @ManyToOne
    @JoinColumn(name = "SupplierID")
    User shipper;
    LocalDateTime orderDate;
    String status;
    BigDecimal totalAmount;
    @ManyToOne
    @JoinColumn(name = "orderGroupID")
    OrderGroup orderGroup;

    String address;
}

