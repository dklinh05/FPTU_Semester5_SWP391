package com.farm.farmtrade.dto.Request.ProductReviewRequest;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class CreateProductReviewRequest {

    @NotNull(message = "Product Quality is required")
    @Min(1)
    @Max(5)
    private Integer productQuality;

    @NotEmpty(message = "Comment cannot be empty")
    private String comment;

    @NotNull(message = "Seller Service is required")
    @Min(1)
    @Max(5)
    private Integer sellerService;

    @NotNull(message = "Delivery Speed is required")
    @Min(1)
    @Max(5)
    private Integer deliverySpeed;

    private String image;

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
}
