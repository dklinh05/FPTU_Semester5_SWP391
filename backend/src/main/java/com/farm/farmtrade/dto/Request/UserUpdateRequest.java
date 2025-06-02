package com.farm.farmtrade.dto.Request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username must contain only letters and numbers")
    private String username;

    @NotBlank(message = "Full name cannot be empty")
    @Pattern(regexp = "^[A-Za-zÀ-ỹ\\s]+$", message = "Full name must only contain letters and spaces")
    private String fullName;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Email must be in the format example@gmail.com")
    private String email;

    @Pattern(regexp = "^0\\d{9}$", message = "Phone number must start with 0 and be exactly 10 digits")
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
