package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.request.ProductReviewRequest.CreateProductReviewRequest;
import com.farm.farmtrade.entity.ProductReview;
import com.farm.farmtrade.service.ProductReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/reviews")
public class ProductReviewController {

    @Autowired
    private ProductReviewService reviewService;

//    @PostMapping("/{productId}/reviews")
    public ResponseEntity<?> createReview(@PathVariable Integer productId,
                                          @RequestBody @Valid CreateProductReviewRequest request,
                                          Principal principal) {
        String username = principal.getName();
        ProductReview review = reviewService.createReview(productId, request, username);
        return ResponseEntity.ok(review);
    }
}
