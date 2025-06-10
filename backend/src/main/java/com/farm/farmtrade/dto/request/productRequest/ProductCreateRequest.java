package com.farm.farmtrade.dto.request.productRequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCreateRequest {
    @NotBlank
    String name;

    @NotNull
    Double price;

    String description;

    @NotNull
    Integer stockQuantity;

    MultipartFile image;
}
