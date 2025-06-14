package com.farm.farmtrade.dto.request.ProductReviewRequest;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
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

}