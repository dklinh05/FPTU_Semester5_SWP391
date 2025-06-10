package com.farm.farmtrade.service;

import com.farm.farmtrade.dto.request.productRequest.ProductCreateRequest;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.ProductRepository;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.service.fileStorage.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Slf4j
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Product addProduct(ProductCreateRequest request) {

        Product product = new Product();


        // Tìm supplier
        User user = userRepository.findById(23).orElseThrow(() -> new RuntimeException("User not found"));

        // Tạo sản phẩm

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(BigDecimal.valueOf(request.getPrice()));

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

//    public List<Product> getProductsBySupplier(Integer supplierId) {
//        return productRepository.findBySupplier_Id(supplierId);
//    }
}
