package com.farm.farmtrade.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "Users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer userID;

    @Column(unique = true, nullable = false)
    String username;
    String passwordHash;
    String fullName;
    String email;
    String phone;
    String role;
    String avatar;
    LocalDateTime createdAt;
    Boolean isActive;

    // Buyer
    String address;
    Integer rewardPoints;
    Long totalSpend;

    // Supplier
    String businessName;
    String certification;
    Long totalRevenue;

    // Shipper
    String vehicle;
    String licensePlate;

}
