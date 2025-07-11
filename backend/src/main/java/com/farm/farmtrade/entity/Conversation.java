package com.farm.farmtrade.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Conversations")
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ConversationID")
    private Long conversationId;

    @Column(name = "Name")
    private String name;

    @Column(name = "IsGroup")
    private Boolean isGroup;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    // Getters and Setters
    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Boolean isGroup() { return isGroup; }
    public void setGroup(Boolean group) { this.isGroup = group; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}