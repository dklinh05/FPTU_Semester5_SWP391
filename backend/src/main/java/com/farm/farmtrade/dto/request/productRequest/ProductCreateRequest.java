package com.farm.farmtrade.dto.request.productRequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCreateRequest {
    @NotBlank
    String name;
    String category;
    String description;

    @NotNull
    String userId;

    @NotNull
    BigDecimal price;
    String unit;
    String origin;
    LocalDateTime createdAt;

    @NotNull
    Integer stockQuantity;
    MultipartFile image;
}
