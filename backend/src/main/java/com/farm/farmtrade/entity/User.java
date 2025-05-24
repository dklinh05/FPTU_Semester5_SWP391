package com.farm.farmtrade.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "Users")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userID;

    @Column(unique = true, nullable = false)
    private String username;
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

    // Getters and setters...
}
