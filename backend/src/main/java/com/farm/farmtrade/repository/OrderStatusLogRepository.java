package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.OrderStatusLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderStatusLogRepository extends JpaRepository<OrderStatusLog, Integer> {}

