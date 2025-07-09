package com.farm.farmtrade.dto.request.chatRequest;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MessageRequestDTO {
    @NotNull(message = "conversationId cannot be null")
    private Long conversationId;

    @NotNull(message = "userId cannot be null")
    private Integer userId;

    @NotBlank(message = "content cannot be empty")
    private String content;

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}