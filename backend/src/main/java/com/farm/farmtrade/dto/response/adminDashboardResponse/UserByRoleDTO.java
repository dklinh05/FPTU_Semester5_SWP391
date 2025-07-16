package com.farm.farmtrade.dto.response.adminDashboardResponse;

import lombok.Data;

@Data
public class UserByRoleDTO {
    private String role;
    private Long count;

    public UserByRoleDTO(String role, Long count) {
        this.role = role;
        this.count = count;
    }

    // Getters & Setters
}