package com.farm.farmtrade.dto.request.authenticationRequest;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username must contain only letters and numbers")
    private String username;

    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]+$",
            message = "Password must contain at least one letter, one number, and one special character"
    )
    private String passwordHash;

    @NotBlank(message = "Full name cannot be empty")
    @Pattern(regexp = "^[A-Za-zÀ-ỹ\\s]+$", message = "Full name must only contain letters and spaces")
    private String fullName;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Email must be in the format example@gmail.com")
    private String email;

    @Pattern(regexp = "^0\\d{9}$", message = "Phone number must start with 0 and be exactly 10 digits")
    private String phone;

    private String role;
//    private MultipartFile avatar;
    private LocalDateTime createdAt;
    private Boolean isActive;

    // Buyer
    private String address;
    private Integer rewardPoints;
    private Long totalSpend;

}
