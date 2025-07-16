package com.farm.farmtrade.service;

import com.farm.farmtrade.dto.response.adminDashboardResponse.TopProductDTO;
import com.farm.farmtrade.dto.response.adminDashboardResponse.UserByRoleDTO;
import com.farm.farmtrade.repository.ProductRepository;
import com.farm.farmtrade.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private UserRepository userRepo;

    public List<TopProductDTO> getTop5Products() {
        return productRepo.findTop5Products();
    }

    public List<UserByRoleDTO> getUsersByRole() {
        return userRepo.countUsersByRole();
    }


}