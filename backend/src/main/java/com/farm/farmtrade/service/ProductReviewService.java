package com.farm.farmtrade.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.farm.farmtrade.dto.request.ProductReviewRequest.CreateProductReviewRequest;
import com.farm.farmtrade.entity.Order;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.entity.ProductReview;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.OrderRepository;
import com.farm.farmtrade.repository.ProductRepository;
import com.farm.farmtrade.repository.ProductReviewRepository;
import com.farm.farmtrade.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

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
    private Cloudinary cloudinary;

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

        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrls = saveImagesAndReturnUrlString(request.getImage());
            review.setImage(imageUrls);
        }

        return productReviewRepository.save(review);
    }

    private String saveImagesAndReturnUrlString(List<MultipartFile> files) {
        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                        ObjectUtils.asMap("resource_type", "auto"));
                String url = (String) uploadResult.get("secure_url");
                imageUrls.add(url);
            } catch (IOException e) {
                throw new RuntimeException("Lỗi khi upload ảnh lên Cloudinary", e);
            }
        }

        return String.join(";", imageUrls);
    }

    public List<ProductReview> getReviewsByProduct(Integer productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<ProductReview> reviews = productReviewRepository.findByProduct(product);

        for (ProductReview review : reviews) {
            if (review.getImage() != null && !review.getImage().isEmpty()) {
                review.setImageList(Arrays.asList(review.getImage().split(";")));
            } else {
                review.setImageList(new ArrayList<>());
            }
        }

        return reviews;
    }
    public ProductReview updateReview(Integer reviewId, com.farm.farmtrade.dto.request.ProductReviewRequest.UpdateProductReviewRequest request, String username) {
        ProductReview existingReview = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!existingReview.getBuyer().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to edit this review");
        }

        existingReview.setProductQuality(request.getProductQuality());
        existingReview.setSellerService(request.getSellerService());
        existingReview.setDeliverySpeed(request.getDeliverySpeed());
        existingReview.setComment(request.getComment());
        existingReview.setImage(request.getImage());

        return productReviewRepository.save(existingReview);
    }

    // Xóa đánh giá
    public void deleteReview(Integer reviewId, String username) {
        ProductReview existingReview = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!existingReview.getBuyer().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to delete this review");
        }

        productReviewRepository.delete(existingReview);
    }
}
