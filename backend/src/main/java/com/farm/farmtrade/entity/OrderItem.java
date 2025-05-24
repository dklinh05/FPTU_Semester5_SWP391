package com.farm.farmtrade.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "OrderItems")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderItemID;

    @ManyToOne
    @JoinColumn(name = "OrderID")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "ProductID")
    private Product product;

    private Integer quantity;
    private BigDecimal price;

    // Getters and setters...
}

