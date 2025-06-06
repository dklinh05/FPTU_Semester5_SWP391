package com.farm.farmtrade.service;

import com.farm.farmtrade.dto.Request.ProductRequest.ProductCreateRequest;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.ProductRepository;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.service.fileStorage.FileStorageService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.query.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.awt.print.Pageable;
import java.math.BigDecimal;
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
    private FileStorageService fileStorageService;

    public List<Product> getAllActiveProducts() {
        return productRepository.findByStatus("active");
    }

//    // Nếu muốn phân trang:
//    public Page<Product> getAllActiveProductsPaged(int page, int size) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
//        return productRepository.findAllByStatus("active", pageable);
//    }

    public Product addProduct(ProductCreateRequest request) {

        Product product = new Product();


        // Tìm supplier
        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));

        // Tạo sản phẩm

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setStockQuantity(request.getStockQuantity());
        product.setSupplier(user);

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

    public List<Product> getProductsBySupplierId(Integer supplierId) {
        return productRepository.findBySupplierUserID(supplierId);
    }

    @Transactional
    public void deleteProductById(Integer productId) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found with ID: " + productId);
        }

        productRepository.deleteById(productId);
    }
}
