package com.farm.farmtrade.dto.request.productRequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductUpdateRequest {
    @NotBlank
    String name;
    String category;
    String description;

    @NotNull
    BigDecimal price;
    String unit;
    String origin;
    LocalDateTime createdAt;

    @NotNull
    Integer stockQuantity;
    Integer sales;
    MultipartFile image;
}
