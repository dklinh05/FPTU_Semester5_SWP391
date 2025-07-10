package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.request.ProductReviewRequest.CreateProductReviewRequest;
import com.farm.farmtrade.dto.response.ReviewResponse;
import com.farm.farmtrade.entity.Order;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.entity.ProductReview;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.OrderRepository;
import com.farm.farmtrade.repository.ProductRepository;
import com.farm.farmtrade.repository.ProductReviewRepository;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.service.ProductReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/reviews")
public class ProductReviewController {

    @Autowired
    private ProductReviewService reviewService;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ProductRepository productRepo;
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private ProductReviewRepository productReviewRepo;

    @PostMapping("/{productId}")
    public ResponseEntity<?> createReview(@PathVariable Integer productId,
                                          @ModelAttribute @Valid CreateProductReviewRequest request,
                                          Principal principal) {
        String username = principal.getName();
        ProductReview review = reviewService.createReview(productId, request, username);
        return ResponseEntity.ok(review);
    }

    @GetMapping("/check-reviewed")
    public ResponseEntity<Boolean> checkIfReviewed(
            @RequestParam Integer productId,
            @RequestParam Integer orderId,
            Principal principal) {

        String username = principal.getName();
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        User buyer = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        boolean exists = productReviewRepo.existsByProductAndBuyerAndOrder(product, buyer, order);
        return ResponseEntity.ok(exists);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ProductReview> updateReview(@PathVariable Integer reviewId,
                                                      @RequestBody @Valid com.farm.farmtrade.dto.request.ProductReviewRequest.UpdateProductReviewRequest request,
                                                      Principal principal) {
        String username = principal.getName();
        ProductReview updatedReview = reviewService.updateReview(reviewId, request, username);
        return ResponseEntity.ok(updatedReview);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Integer reviewId,
            Principal principal) {
        String username = principal.getName();
        reviewService.deleteReview(reviewId, username);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProduct(@PathVariable Integer productId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/detail")
    public ResponseEntity<ReviewResponse> getReviewDetail(
            @RequestParam Integer productId,
            @RequestParam Integer orderId,
            Principal principal) {

        String username = principal.getName();
        ReviewResponse review = reviewService.getReviewDetail(productId, orderId, username);
        return ResponseEntity.ok(review);
    }
}
