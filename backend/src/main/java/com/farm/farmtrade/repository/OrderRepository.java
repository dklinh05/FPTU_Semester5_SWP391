package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Integer> {}