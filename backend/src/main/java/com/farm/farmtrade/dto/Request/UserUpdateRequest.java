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
public class UserUpdateRequest {
//    private String username;
//    private String email;
//
//    public String getUsername() { return username; }
//    public void setUsername(String username) { this.username = username; }
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }
private String fullName;
    private String phone;
    private String address;


//    private String fullName;
//    private String email;
//    private String phone;
//    private String role;
//    private String avatar;
//    private LocalDateTime createdAt;
//    private Boolean isActive;
//
//    // Buyer
//    private String address;
//    private Integer rewardPoints;
//    private Long totalSpend;
//
//    // Supplier
//    private String businessName;
//    private String certification;
//    private Long totalRevenue;
//
//    // Shipper
//    private String vehicle;
//    private String licensePlate;

}
