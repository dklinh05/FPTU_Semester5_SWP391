package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.RoleUpgrade;
import com.farm.farmtrade.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleUpgradeRepository extends JpaRepository<RoleUpgrade, Integer> {
    List<RoleUpgrade> findByStatus(String status);
}
