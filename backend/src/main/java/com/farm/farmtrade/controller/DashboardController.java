package com.farm.farmtrade.controller;
import com.farm.farmtrade.dto.response.DashboardStats;
import com.farm.farmtrade.dto.response.adminDashboardResponse.TopProductDTO;
import com.farm.farmtrade.dto.response.adminDashboardResponse.UserByRoleDTO;
import com.farm.farmtrade.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/top-products")
    public List<TopProductDTO> getTop5Products() {
        return dashboardService.getTop5Products();
    }

    @GetMapping("/users-by-role")
    public List<UserByRoleDTO> getUsersByRole() {
        return dashboardService.getUsersByRole();
    }

    @GetMapping("/stats")
    public DashboardStats getDashboardStats() {
        String sqlOrders = "SELECT COUNT(*) FROM Orders";
        String sqlUsers = "SELECT COUNT(*) FROM Users";
        String sqlProducts = "SELECT COUNT(*) FROM Products";

        Long totalOrders = jdbcTemplate.queryForObject(sqlOrders, Long.class);
        Long totalUsers = jdbcTemplate.queryForObject(sqlUsers, Long.class);
        Long totalProducts = jdbcTemplate.queryForObject(sqlProducts, Long.class);

        return new DashboardStats(totalOrders, totalUsers, totalProducts);
    }
}