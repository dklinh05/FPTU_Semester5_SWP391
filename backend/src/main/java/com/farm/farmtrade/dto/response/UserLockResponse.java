package com.farm.farmtrade.dto.response;

public class UserLockResponse {

    private Integer userId;
    private Boolean isLocked;
    public UserLockResponse(Integer userId, Boolean isLocked) {
        this.userId = userId;
        this.isLocked = isLocked;
    }

    // Getters and Setters
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Boolean getIsLocked() {
        return isLocked;
    }

    public void setIsLocked(Boolean isLocked) {
        this.isLocked = isLocked;
    }
}
