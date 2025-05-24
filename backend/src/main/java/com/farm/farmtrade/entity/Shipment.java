package com.farm.farmtrade.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Shipments")
public class Shipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer shipmentID;

    @OneToOne
    @JoinColumn(name = "OrderID")
    private Order order;

    private String deliveryStatus;
    private LocalDateTime deliveryTime;

    // Getters and setters...
}

