package com.farm.farmtrade.dto.request.ProductReviewRequest;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProductReviewRequest {

    @Min(1)
    @Max(5)
    private Integer productQuality;

    @Min(1)
    @Max(5)
    private Integer sellerService;

    @Min(1)
    @Max(5)
    private Integer deliverySpeed;

    @Size(max = 1000, message = "Comment cannot exceed 1000 characters")
    private String comment;

    private String image;


}