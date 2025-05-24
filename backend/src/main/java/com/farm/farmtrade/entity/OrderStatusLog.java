package com.farm.farmtrade.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "OrderStatusLogs")
public class OrderStatusLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer logID;

    @ManyToOne
    @JoinColumn(name = "OrderID")
    private Order order;

    private String status;
    private LocalDateTime updatedAt;
    private String note;

    // Getters and setters...
}

