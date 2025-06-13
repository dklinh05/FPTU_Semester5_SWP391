package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findByOrderOrderID(Integer orderId);

    @Transactional
    void deleteByProductProductID(Integer productId);

    boolean existsByProductProductID(Integer productId);
}

