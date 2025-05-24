package com.farm.farmtrade.dto.Request;


import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String passwordHash;
    private String fullName;
    private String email;
    private String phone;
}
