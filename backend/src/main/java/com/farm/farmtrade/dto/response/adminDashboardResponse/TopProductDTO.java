package com.farm.farmtrade.dto.response.adminDashboardResponse;
import lombok.Data;
@Data
public class TopProductDTO {
    private String name;
    private Integer sales;

    public TopProductDTO(String name, Integer sales) {
        this.name = name;
        this.sales = sales;
    }

    // Getters & Setters
}