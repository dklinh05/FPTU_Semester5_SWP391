package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Order;
import com.farm.farmtrade.entity.OrderGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderGroupRepository extends JpaRepository<OrderGroup, Integer> {
    List<OrderGroup> findByBuyerUserID(Integer buyerId);

}
