package com.farm.farmtrade.dto.response.chatResponse;


import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;


public class MessageResponseDTO {
    private Long messageId;
    private Long conversationId;
    private Integer senderId;
    private String content;
    private LocalDateTime sentAt;
    private boolean isRead;

    public MessageResponseDTO(Long messageId, Integer senderId, String content, LocalDateTime now) {
        this.messageId = messageId;
        this.senderId = senderId;
        this.content = content;
        this.sentAt = now;
    }

    public MessageResponseDTO() {
    }

    // Getters and setters
    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean isRead) {
        this.isRead = isRead;
    }
}