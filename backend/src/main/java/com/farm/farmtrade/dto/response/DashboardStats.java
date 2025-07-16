package com.farm.farmtrade.dto.response;
// DashboardStats.java
public class DashboardStats {
    private Long totalOrders;
    private Long totalUsers;
    private Long totalProducts;

    public DashboardStats(Long totalOrders, Long totalUsers, Long totalProducts) {
        this.totalOrders = totalOrders;
        this.totalUsers = totalUsers;
        this.totalProducts = totalProducts;
    }

    // Getters & Setters
    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public Long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(Long totalProducts) { this.totalProducts = totalProducts; }
}