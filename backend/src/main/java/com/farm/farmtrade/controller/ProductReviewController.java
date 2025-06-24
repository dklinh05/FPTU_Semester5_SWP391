package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.request.ProductReviewRequest.CreateProductReviewRequest;
import com.farm.farmtrade.entity.ProductReview;
import com.farm.farmtrade.service.ProductReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ProductReviewController {

    @Autowired
    private ProductReviewService reviewService;

    @PostMapping("/{productId}")
    public ResponseEntity<?> createReview(@PathVariable Integer productId,
                                          @ModelAttribute @Valid CreateProductReviewRequest request,
                                          Principal principal) {
        String username = principal.getName();
        ProductReview review = reviewService.createReview(productId, request, username);
        return ResponseEntity.ok(review);
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
    public ResponseEntity<List<ProductReview>> getReviewsByProduct(@PathVariable Integer productId) {
        List<ProductReview> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }

}
