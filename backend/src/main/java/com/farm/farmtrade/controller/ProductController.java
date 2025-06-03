package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.Request.ProductRequest.ProductCreateRequest;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@Slf4j
public class ProductController {
    @Autowired
    private ProductService productService;

    // Add product
    @PostMapping
    public ResponseEntity<Product> addProduct(@ModelAttribute ProductCreateRequest product) {
        log.warn(product.toString());
        return ResponseEntity.ok(productService.addProduct(product));
    }

    // Update product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Integer id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Optional: get products by supplier
//    @GetMapping("/supplier/{supplierId}")
//    public ResponseEntity<List<Product>> getProductsBySupplier(@PathVariable Integer supplierId) {
//        return ResponseEntity.ok(productService.getProductsBySupplier(supplierId));
//    }
}
