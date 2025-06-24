package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Order;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.entity.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByBuyer(User buyer);

    List<Order> findByOrderGroupOrderGroupID(Integer orderGroupId);

    Page<Order> findBySupplierUserIDAndStatus(Integer supplierId, String status, Pageable pageable);

    Page<Order> findBySupplierUserID(Integer supplierId, Pageable pageable);
}