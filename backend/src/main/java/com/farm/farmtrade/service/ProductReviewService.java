package com.farm.farmtrade.service;

import com.farm.farmtrade.dto.Request.ProductReviewRequest.CreateProductReviewRequest;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.entity.ProductReview;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.ProductRepository;
import com.farm.farmtrade.repository.ProductReviewRepository;
import com.farm.farmtrade.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ProductReviewService {

    @Autowired
    private ProductReviewRepository productReviewRepository;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProductRepository productRepo;

    public ProductReview createReview(Integer productId, CreateProductReviewRequest request, String username) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User buyer = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setBuyer(buyer);
        review.setProductQuality(request.getProductQuality());
        review.setComment(request.getComment());
        review.setSellerService(request.getSellerService());
        review.setDeliverySpeed(request.getDeliverySpeed());
        review.setImage(request.getImage());
        review.setReviewDate(LocalDateTime.now());

        return productReviewRepository.save(review);
    }
}
