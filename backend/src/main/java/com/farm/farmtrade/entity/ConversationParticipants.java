package com.farm.farmtrade.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ConversationParticipants")
public class ConversationParticipants {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long participantId;

    @Column(name = "ConversationID", nullable = false)
    private Long conversationId;

    @Column(name = "UserID", nullable = false)
    private Integer userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role", columnDefinition = "ENUM('Admin', 'Member') DEFAULT 'Member'")
    private ParticipantRole role = ParticipantRole.Member;

    @Column(name = "JoinedAt", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime joinedAt;

    // Getters and Setters
    public Long getParticipantId() { return participantId; }
    public void setParticipantId(Long participantId) { this.participantId = participantId; }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public ParticipantRole getRole() { return role; }
    public void setRole(ParticipantRole role) { this.role = role; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }

    public enum ParticipantRole {
        Admin, Member
    }
}