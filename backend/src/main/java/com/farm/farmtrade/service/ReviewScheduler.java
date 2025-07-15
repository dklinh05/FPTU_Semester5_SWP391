package com.farm.farmtrade.service;

import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.entity.ProductReview;
import com.farm.farmtrade.repository.ProductRepository;
import com.farm.farmtrade.repository.ProductReviewRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@Slf4j
@RequiredArgsConstructor
public class ReviewScheduler {

    private final ProductRepository productRepository;
    private final ProductReviewRepository reviewRepository;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void updateAllProductRatings() {
        List<ProductReview> reviews = reviewRepository.findAll();

        Map<Integer, Double> avgRatings = reviews.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getProduct().getProductID(),
                        Collectors.averagingDouble(r -> (
                                r.getProductQuality() + r.getSellerService() + r.getDeliverySpeed()) / 3.0)
                ));

        for (Map.Entry<Integer, Double> entry : avgRatings.entrySet()) {
            Product product = productRepository.findById(entry.getKey()).orElse(null);
            if (product != null) {
                product.setRating(entry.getValue());
                productRepository.save(product);
            }
        }

        log.info("Đã cập nhật rating cho {} sản phẩm", avgRatings.size());
    }
}