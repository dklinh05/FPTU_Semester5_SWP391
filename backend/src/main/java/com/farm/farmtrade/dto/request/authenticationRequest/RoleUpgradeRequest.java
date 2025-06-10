package com.farm.farmtrade.dto.request.authenticationRequest;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleUpgradeRequest {
    private Integer userId;
    private String requestedRole;
    private String businessName;
    private String certification;
}

