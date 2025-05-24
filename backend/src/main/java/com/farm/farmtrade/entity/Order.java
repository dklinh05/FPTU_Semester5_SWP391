package com.farm.farmtrade.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderID;

    @ManyToOne
    @JoinColumn(name = "BuyerID")
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "ShipperID")
    private User shipper;

    private LocalDateTime orderDate;
    private String status;
    private BigDecimal totalAmount;

    // Getters and setters...
}

