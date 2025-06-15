package com.farm.farmtrade.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
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

    private Integer productQuality;
    private String comment;
    private Integer sellerService;
    private Integer deliverySpeed;
    private String image;
    private LocalDateTime reviewDate;

}
