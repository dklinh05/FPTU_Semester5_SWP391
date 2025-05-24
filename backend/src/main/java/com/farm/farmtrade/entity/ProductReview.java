package com.farm.farmtrade.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ProductReviews")
public class ProductReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reviewID;

    @ManyToOne
    @JoinColumn(name = "ProductID")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "BuyerID")
    private User buyer;

    private Integer rating;
    private String comment;
    private LocalDateTime reviewDate;

    // Getters and setters...
}
