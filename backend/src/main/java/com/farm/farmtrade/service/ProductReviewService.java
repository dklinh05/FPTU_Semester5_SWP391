package com.farm.farmtrade.service;

import com.farm.farmtrade.dto.request.ProductReviewRequest.CreateProductReviewRequest;
import com.farm.farmtrade.dto.request.ProductReviewRequest.UpdateProductReviewRequest;
import com.farm.farmtrade.dto.response.ReviewResponse;
import com.farm.farmtrade.entity.Order;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.entity.ProductReview;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.OrderRepository;
import com.farm.farmtrade.repository.ProductRepository;
import com.farm.farmtrade.repository.ProductReviewRepository;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.service.fileStorage.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class ProductReviewService {

    @Autowired
    private ProductReviewRepository productReviewRepository;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private FileStorageService fileStorageService;

    public ProductReview createReview(Integer productId, CreateProductReviewRequest request, String username) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User buyer = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepo.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        boolean exists = productReviewRepository.existsByProductAndBuyerAndOrder(product, buyer, order);
        if (exists) {
            throw new RuntimeException("Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi.");
        }

        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setBuyer(buyer);
        review.setOrder(order);
        review.setProductQuality(request.getProductQuality());
        review.setSellerService(request.getSellerService());
        review.setDeliverySpeed(request.getDeliverySpeed());
        review.setComment(request.getComment());
        review.setReviewDate(LocalDateTime.now());

        ProductReview savedReview = productReviewRepository.save(review);

        if (request.getImage() != null && !request.getImage().isEmpty()) {
            List<MultipartFile> images = request.getImage();
            if (images.size() > 5) {
                images = images.subList(0, 5);
            }

            List<String> imageUrls = fileStorageService.uploadReviewImages(images, savedReview.getReviewID());
            savedReview.setImage(String.join(";", imageUrls));
            productReviewRepository.save(savedReview);
        }

        int current = buyer.getRewardPoints() != null ? buyer.getRewardPoints() : 0;
        buyer.setRewardPoints(current + 200);
        userRepo.save(buyer);

        return savedReview;
    }

    public ReviewResponse getReviewDetail(Integer productId, Integer orderId, String username) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        User buyer = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        ProductReview review = productReviewRepository
                .findByProductAndBuyerAndOrder(product, buyer, order)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        ReviewResponse dto = new ReviewResponse();
        dto.setReviewID(review.getReviewID());
        dto.setComment(review.getComment());
        dto.setProductQuality(review.getProductQuality());
        dto.setSellerService(review.getSellerService());
        dto.setDeliverySpeed(review.getDeliverySpeed());
        dto.setReviewDate(review.getReviewDate());
        dto.setBuyerUsername(buyer.getUsername());

        if (review.getImage() != null && !review.getImage().isEmpty()) {
            dto.setImageList(Arrays.asList(review.getImage().split(";")));
        }

        return dto;
    }

    public Optional<ReviewResponse> getReviewByProductOrderBuyer(Integer productId, Integer orderId, String username) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User buyer = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return productReviewRepository.findByProductAndBuyerAndOrder(product, buyer, order)
                .map(review -> {
                    ReviewResponse dto = new ReviewResponse();
                    dto.setReviewID(review.getReviewID());
                    dto.setComment(review.getComment());
                    dto.setProductQuality(review.getProductQuality());
                    dto.setSellerService(review.getSellerService());
                    dto.setDeliverySpeed(review.getDeliverySpeed());
                    dto.setReviewDate(review.getReviewDate());
                    dto.setBuyerUsername(review.getBuyer().getUsername());

                    if (review.getImage() != null && !review.getImage().isEmpty()) {
                        dto.setImageList(Arrays.asList(review.getImage().split(";")));
                    }
                    return dto;
                });
    }

    public List<ReviewResponse> getFilteredReviews(Integer productId, Integer rating, Boolean hasComment, Boolean hasImage) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<ProductReview> all = productReviewRepository.findByProduct(product);

        List<ProductReview> filtered = all.stream()
                .filter(r -> {
                    double avg = (r.getProductQuality() + r.getSellerService() + r.getDeliverySpeed()) / 3.0;
                    boolean matchRating = rating == null || Math.round(avg) == rating;
                    boolean matchComment = hasComment == null || (hasComment && r.getComment() != null && !r.getComment().isBlank());
                    boolean matchImage = hasImage == null || (hasImage && r.getImage() != null && !r.getImage().isBlank());
                    return matchRating && matchComment && matchImage;
                })
                .collect(Collectors.toList());

        return filtered.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private ReviewResponse mapToDto(ProductReview review) {
        ReviewResponse dto = new ReviewResponse();
        dto.setReviewID(review.getReviewID());
        dto.setComment(review.getComment());
        dto.setProductQuality(review.getProductQuality());
        dto.setSellerService(review.getSellerService());
        dto.setDeliverySpeed(review.getDeliverySpeed());
        dto.setReviewDate(review.getReviewDate());
        dto.setBuyerUsername(review.getBuyer().getUsername());

        if (review.getImage() != null && !review.getImage().isEmpty()) {
            dto.setImageList(Arrays.asList(review.getImage().split(";")));
        }

        return dto;
    }

    public ProductReview updateReview(Integer reviewId, UpdateProductReviewRequest request, String username) {
        ProductReview existingReview = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!existingReview.getBuyer().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to edit this review");
        }

        existingReview.setProductQuality(request.getProductQuality());
        existingReview.setSellerService(request.getSellerService());
        existingReview.setDeliverySpeed(request.getDeliverySpeed());
        existingReview.setComment(request.getComment());

        if (request.getImage() != null && !request.getImage().isEmpty()) {
            List<MultipartFile> images = request.getImage();
            if (images.size() > 5) {
                images = images.subList(0, 5);
            }
            List<String> imageUrls = fileStorageService.uploadReviewImages(images, reviewId);
            existingReview.setImage(String.join(";", imageUrls));
        }

        return productReviewRepository.save(existingReview);
    }

    public void deleteReview(Integer reviewId, String username) {
        ProductReview existingReview = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!existingReview.getBuyer().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to delete this review");
        }

        productReviewRepository.delete(existingReview);
    }
}
