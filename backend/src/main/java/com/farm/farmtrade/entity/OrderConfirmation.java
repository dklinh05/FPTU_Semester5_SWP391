package com.farm.farmtrade.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "OrderConfirmations")
public class OrderConfirmation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer confirmationID;

    @ManyToOne
    @JoinColumn(name = "OrderID")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "BuyerID")
    private User buyer;

    private Boolean isSatisfied;
    private String feedback;
    private LocalDateTime confirmedAt;

    // Getters and setters...
}

