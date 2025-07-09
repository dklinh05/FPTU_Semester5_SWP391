package com.farm.farmtrade.dto.request.ProductReviewRequest;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class CreateProductReviewRequest {

    @NotNull(message = "Product Quality is required")
    @Min(1)
    @Max(5)
    private Integer productQuality;
//    @NotEmpty(message = "Comment cannot be empty")
    private String comment;

    @NotNull(message = "Seller Service is required")
    @Min(1)
    @Max(5)
    private Integer sellerService;

    @NotNull(message = "Delivery Speed is required")
    @Min(1)
    @Max(5)
    private Integer deliverySpeed;

    private List<MultipartFile> image;

    @NotNull
    private Integer orderId;
}
