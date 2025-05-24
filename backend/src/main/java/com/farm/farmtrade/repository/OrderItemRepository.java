package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {}

