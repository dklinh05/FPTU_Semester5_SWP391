package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Order;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.entity.ProductReview;
import com.farm.farmtrade.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Integer> {
//    List<ProductReview> findByProduct(Product product);
//    List<ProductReview> findByBuyer(User buyer);
    boolean existsByProductAndBuyerAndOrder(Product product, User buyer, Order order);
    Optional<ProductReview> findByBuyerUserIDAndProductProductIDAndOrderOrderID(Integer buyerId, Integer productId, Integer orderId);
    List<ProductReview> findByProduct(Product product);
}
