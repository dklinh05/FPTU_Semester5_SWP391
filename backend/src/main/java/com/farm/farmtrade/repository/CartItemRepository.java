package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    Optional<CartItem> findByBuyerUserIDAndProductProductID(Integer buyerId, Integer productId);

    void deleteByBuyerUserIDAndProductProductID(Integer buyerId, Integer productId);

    List<CartItem> findByBuyerUserID(Integer buyerId);

    @Transactional
    void deleteByProductProductID(Integer productId);

    boolean existsByProductProductID(Integer productId);
}