package com.farm.farmtrade.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentID;

    @OneToOne
    @JoinColumn(name = "OrderID")
    private Order order;

    private String method;
    private BigDecimal amount;
    private String status;
    private LocalDateTime paymentDate;

    // Getters and setters...
}

