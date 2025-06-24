package com.farm.farmtrade.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

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

    @ManyToOne
    @JoinColumn(name = "OrderID")
    private Order order;

    private Integer productQuality;
    private String comment;
    private Integer sellerService;
    private Integer deliverySpeed;
    private String image;
    private LocalDateTime reviewDate;

    @Transient
    private List<String> imageList;

}
