package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Order;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    long countByVoucher(Voucher voucher);
    List<Order> findByBuyer(User buyer);

}