package com.farm.farmtrade.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "RoleUpgradeRequests")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleUpgrade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer requestID;

    @ManyToOne
    @JoinColumn(name = "userID")
    private User user;

//    private String requestedRole; // e.g., SUPPLIER
    private String businessName;
    private String certification;

    private String status = "PENDING"; // PENDING, APPROVED, REJECTED
    private String adminNote;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime reviewedAt;
}
