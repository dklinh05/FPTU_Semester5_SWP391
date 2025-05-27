package com.farm.farmtrade.dto.Request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangePasswordRequest {
    String userId;

    @Size(min = 8, message = "Password must be at least 8 characters")
    String oldPassword;
    
    @Size(min = 8, message = "Password must be at least 8 characters")
    String newPassword;
    

} 