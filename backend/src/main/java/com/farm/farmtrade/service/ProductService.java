package com.farm.farmtrade.service;


import com.farm.farmtrade.dto.request.productRequest.ProductCreateRequest;
import com.farm.farmtrade.entity.OrderItem;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.*;
import com.farm.farmtrade.service.fileStorage.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

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

//    public List<Product> searchProducts(String keyword) {
//        return productRepository.findProductsByName(keyword);
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
        return productRepository.findBySupplierUserIDAndStatus(supplierId, "active", pageable);
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
}
