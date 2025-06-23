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

    //    @GetMapping("/search")
//    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
//        List<Product> products = productService.searchProducts(keyword);
//        return ResponseEntity.ok(products);
//    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> products = productService.searchProducts(keyword);
        return ResponseEntity.ok(products);
    }

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

    @GetMapping("/best-sellers")
    public ResponseEntity<Page<Product>> listBestSellerProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        // Mặc định sắp xếp theo sales giảm dần
        Pageable pageable = PageRequest.of(page, size, Sort.by("sales").descending());
        Page<Product> products = productService.getBestSellerProducts(pageable);
        return ResponseEntity.ok(products);
    }



    @GetMapping("/category")
    public ResponseEntity<Page<Product>> getProductsByCategory(
            @RequestParam(required = false) String category,
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

        Page<Product> products = productService.getActiveProductsByCategory(category, pageable);
        return ResponseEntity.ok(products);
    }

    // Add product
//    @PostMapping
//    public ResponseEntity<Product> addProduct(@ModelAttribute ProductCreateRequest product) {
//        log.warn(product.toString());
//        return ResponseEntity.ok(productService.addProduct(product));
//    }

    @PostMapping
    public ResponseEntity<Product> addProduct(@ModelAttribute ProductCreateRequest request) {
        log.warn("Received product data: {}", request);
        Product product = productService.addProduct(request);
        return ResponseEntity.ok(product);
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

    @GetMapping("/pending")
    public ResponseEntity<List<Product>> getPendingProducts() {
        List<Product> products = productService.getProductsByStatus("Pending");
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Product> updateProductStatus(@PathVariable Integer id, @RequestParam String status) {
        Product updatedProduct = productService.updateProductStatus(id, status);
        return ResponseEntity.ok(updatedProduct);
    }


}
