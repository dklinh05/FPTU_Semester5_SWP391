package com.farm.farmtrade.dto.request.authenticationRequest;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleUpgradeRequest {
    private Integer userId;
    private String businessName;
    private MultipartFile certification;
}

