package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {}