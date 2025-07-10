package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Order;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.entity.ProductReview;
import com.farm.farmtrade.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Integer> {
    boolean existsByProductAndBuyerAndOrder(Product product, User buyer, Order order);
    List<ProductReview> findByProduct(Product product);
    Optional<ProductReview> findByProductAndBuyerAndOrder(Product product, User buyer, Order order);
}
