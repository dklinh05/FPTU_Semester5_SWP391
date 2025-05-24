package com.farm.farmtrade.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer notificationID;

    @ManyToOne
    @JoinColumn(name = "UserID")
    private User user;

    private String title;
    private String message;
    private String type;
    private Boolean isRead;
    private LocalDateTime createdAt;

    // Getters and setters...
}

