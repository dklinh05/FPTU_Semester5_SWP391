package com.farm.farmtrade.controller;


import com.farm.farmtrade.dto.request.productRequest.ProductCreateRequest;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/products")
@Slf4j
public class ProductController {
    @Autowired
    private ProductService productService;

    // Lấy danh sách sản phẩm không phân trang
//    @GetMapping
//    public ResponseEntity<List<Product>> listProductsForHome() {
//        List<Product> products = productService.getAllActiveProducts();
//        return ResponseEntity.ok(products);
//    }

    @GetMapping
    public ResponseEntity<Page<Product>> listProductsForHome(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending()
        );
        Page products = productService.getActiveProductsWithPagination(pageable);
        return ResponseEntity.ok(products);
    }


    // Add product
    @PostMapping
    public ResponseEntity<Product> addProduct(@ModelAttribute ProductCreateRequest product) {
        log.warn(product.toString());
        return ResponseEntity.ok(productService.addProduct(product));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }


    // Update product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Integer id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    // Delete product
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer productId) {
        try {
            productService.deleteProductById(productId);
            return ResponseEntity.ok().body("Product deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<Page<Product>> getProductsBySupplier(
            @PathVariable Integer supplierId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending()
        );
        Page<Product> products = productService.getProductsBySupplierId(supplierId, pageable);
        return ResponseEntity.ok(products);
    }



}
