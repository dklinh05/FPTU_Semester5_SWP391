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

    private Integer productQuality;
    private String comment;
    private Integer sellerService;
    private Integer deliverySpeed;
    private String image;
    private LocalDateTime reviewDate;

    public Integer getReviewID() { return reviewID; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public User getBuyer() { return buyer; }
    public void setBuyer(User buyer) { this.buyer = buyer; }

    public Integer getProductQuality() { return productQuality; }
    public void setProductQuality(Integer productQuality) { this.productQuality = productQuality; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Integer getSellerService() { return sellerService; }
    public void setSellerService(Integer sellerService) { this.sellerService = sellerService; }

    public Integer getDeliverySpeed() { return deliverySpeed; }
    public void setDeliverySpeed(Integer deliverySpeed) { this.deliverySpeed = deliverySpeed; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public LocalDateTime getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDateTime reviewDate) { this.reviewDate = reviewDate; }
}
