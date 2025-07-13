package com.farm.farmtrade.dto.response.chatResponse;

public class SupplierDTO {
    private Integer userId;
    private String fullName;

    public SupplierDTO(Integer userId, String fullName) {
        this.userId = userId;
        this.fullName = fullName;
    }

    // Getters and Setters
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
}