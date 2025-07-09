package com.farm.farmtrade.dto.request.chatRequest;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class ConversationRequestDTO {
    @NotEmpty(message = "userIds cannot be empty")
    private List<Integer> userIds;

    private boolean isGroup;

   // @NotNull(message = "name cannot be null for group conversations")
    private String name;

    public List<Integer> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Integer> userIds) {
        this.userIds = userIds;
    }

    public boolean isGroup() {
        return isGroup;
    }

    public void setIsGroup(boolean isGroup) {
        this.isGroup = isGroup;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}