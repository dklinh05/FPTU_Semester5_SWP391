package com.farm.farmtrade.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "CartItems")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cartItemID;

    @ManyToOne
    @JoinColumn(name = "BuyerID")
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "ProductID")
    private Product product;

    private Integer quantity;
    private LocalDateTime createdAt;

    // Getters and setters...
}

