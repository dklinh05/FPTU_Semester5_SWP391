package com.farm.farmtrade.service;


import com.farm.farmtrade.dto.request.productRequest.ProductCreateRequest;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.*;
import com.farm.farmtrade.service.fileStorage.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<Product> getAllActiveProducts() {
        return productRepository.findAllByStatus("active");
    }

//    // Nếu muốn phân trang:
//    public Page<Product> getAllActiveProductsPaged(int page, int size) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
//        return productRepository.findAllByStatus("active", pageable);
//    }

    public List<Product> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    public Product addProduct(ProductCreateRequest request) {
        Product product = new Product();

        User user = userRepository.findById(Integer.valueOf(request.getUserId()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());

        // ✅ Bổ sung các dòng này
        product.setOrigin(request.getOrigin());
        product.setUnit(request.getUnit());
        product.setStockQuantity(request.getStockQuantity());

        product.setSupplier(user);
        product.setStatus("Pending");
        product.setSales(0);

        productRepository.save(product);

        product = fileStorageService.uploadProductImage(String.valueOf(product.getProductID()), request.getImage());

        return product;
    }

    public Product updateProduct(Integer id, Product updatedProduct) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(updatedProduct.getName());
        product.setDescription(updatedProduct.getDescription());
        product.setPrice(updatedProduct.getPrice());
        product.setStockQuantity(updatedProduct.getStockQuantity());
//        product.setImageUrl(updatedProduct.getImageUrl());

        return productRepository.save(product);
    }

    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }

    public Page<Product> getProductsBySupplierId(Integer supplierId, Pageable pageable) {
        return productRepository.findBySupplierUserID(supplierId, pageable);
    }

    public Page<Product> getBestSellerProducts(Pageable pageable) {
        return productRepository.findPageByStatus("active", pageable);
    }

    public Page<Product> getActiveProductsWithPagination(Pageable pageable) {

        return productRepository.findPageByStatus("active", pageable);
    }

    public Page<Product> getActiveProductsByCategory(String category, Pageable pageable) {
        if (category == null || category.trim().isEmpty()) {
            return productRepository.findPageByStatus("active", pageable);
        }else{
            return productRepository.findPageByCategoryAndStatus(category, "active", pageable);
        }

    }

    public Page<Product> getFilteredProducts(String keyword, String category, Double lat, Double lng,Double rating, String latest, Pageable pageable) {
        List<Product> allProducts = productRepository.findAllByStatus("active");

        // Lọc theo từ khóa nếu có
        if (keyword != null && !keyword.isBlank()) {
            String lowerKeyword = keyword.toLowerCase();
            allProducts = productRepository.findByNameContainingIgnoreCaseAndStatus(keyword, "active");
        }

        // Lọc theo category nếu có
        if (category != null && !category.isBlank()) {
            allProducts = allProducts.stream()
                    .filter(p -> category.equalsIgnoreCase(p.getCategory()))
                    .collect(Collectors.toList());
        }

        // Nếu có lat/lng → sắp xếp theo khoảng cách
        if (lat != null && lng != null) {
            allProducts.sort(Comparator.comparingDouble(p -> {
                double productLat = p.getSupplier().getLat();
                double productLng = p.getSupplier().getLng();
                return haversineDistance(lat, lng, productLat, productLng);
            }));
        }
        if (rating != null) {
            allProducts = allProducts.stream()
                    .filter(p -> p.getRating() != null && p.getRating() >= rating)
                    .collect(Collectors.toList());
        }

        if ("new_arrival".equalsIgnoreCase(latest)) {
            allProducts = allProducts.stream()
                    .filter(p -> p.getCreatedAt() != null && p.getCreatedAt().isAfter(LocalDateTime.now().minusDays(30)))
                    .collect(Collectors.toList());
        }

        // Tạo Page thủ công
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allProducts.size());
        List<Product> pageContent = allProducts.subList(start, end);

        return new PageImpl<>(pageContent, pageable, allProducts.size());
    }


    @Transactional
    public void deleteProductById(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Xóa các cart items nếu có
        if (cartItemRepository.existsByProductProductID(productId)) {
            cartItemRepository.deleteByProductProductID(productId);
        }

        // Xóa các order items nếu có
        if (orderItemRepository.existsByProductProductID(productId)) {
            orderItemRepository.deleteByProductProductID(productId);
        }

        // Cuối cùng xóa product
        productRepository.delete(product);
    }


    public Product getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + id));
    }
    public List<Product> getProductsByStatus(String status) {
        return productRepository.findAllByStatus(status);
    }


    public Product updateProductStatus(Integer productId, String status) {
        if (productId == null || status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("ID hoặc status không hợp lệ");
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));

        product.setStatus(status.trim());
        return productRepository.save(product);
    }

    public static double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public Page<Product> getBestSellerProductsByShop(Integer sellerId, Pageable pageable) {
        return productRepository.findPageBySupplierUserIDAndStatus(sellerId, "Active", pageable);
    }

}
