package com.farm.farmtrade.dto.response.chatResponse;

import java.time.LocalDateTime;
import java.util.List;

public class ConversationResponseDTO {
    private Long conversationId;
    private String name;
    private boolean isGroup;
    private LocalDateTime createdAt;
    private List<Integer> userIds;
    private String error; // Thêm trường error để chứa thông báo lỗi

    // Constructor cho trường hợp thành công
    public ConversationResponseDTO(Long conversationId, List<Integer> userIDs, boolean group, String name) {
        this.conversationId = conversationId;
        this.userIds = userIDs;
        this.isGroup = group;
        this.name = name;
        this.createdAt = LocalDateTime.now(); // Gán giá trị mặc định cho createdAt
    }

    // Constructor cho trường hợp lỗi
    public ConversationResponseDTO(Long conversationId, List<Integer> userIDs, boolean group, String name, String error) {
        this.conversationId = conversationId;
        this.userIds = userIDs;
        this.isGroup = group;
        this.name = name;
        this.createdAt = null; // Không gán createdAt khi lỗi
        this.error = error;
    }

    public ConversationResponseDTO() {
    }

    // Getters and setters
    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isGroup() {
        return isGroup;
    }

    public void setIsGroup(boolean isGroup) {
        this.isGroup = isGroup;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Integer> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Integer> userIds) {
        this.userIds = userIds;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}