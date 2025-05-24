package com.farm.farmtrade.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Disputes")
public class Dispute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer disputeID;

    @ManyToOne
    @JoinColumn(name = "OrderID")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "InitiatorID")
    private User initiator;

    @ManyToOne
    @JoinColumn(name = "RecipientID")
    private User recipient;

    private String initiatorRole;
    private String recipientRole;
    private String description;
    private String status;
    private String resolution;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and setters...
}

