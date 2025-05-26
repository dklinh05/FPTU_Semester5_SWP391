package com.farm.farmtrade.dto.Request;


import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    @Size(min = 3, message = "Username must be at least 3 characters")
    private String username;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String passwordHash;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String avatar;
    private LocalDateTime createdAt;
    private Boolean isActive;

    // Buyer
    private String address;
    private Integer rewardPoints;
    private Long totalSpend;

    // Supplier
    private String businessName;
    private String certification;
    private Long totalRevenue;

    // Shipper
    private String vehicle;
    private String licensePlate;
}
