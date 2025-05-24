package com.farm.farmtrade.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productID;

    @ManyToOne
    @JoinColumn(name = "SupplierID")
    private User supplier;

    private String name;
    private String category;
    private String description;
    private BigDecimal price;
    private String unit;
    private String origin;
    private String imageURL;
    private LocalDateTime createdAt;
    private Integer stockQuantity;
    private Integer sales;
    private String status;

    // Getters and setters...
}

