package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.Request.ProductRequest.ProductCreateRequest;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.query.Page;
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

    // Lấy danh sách sản phẩm không phân trang
    @GetMapping
    public ResponseEntity<List<Product>> listProductsForHome() {
        List<Product> products = productService.getAllActiveProducts();
        return ResponseEntity.ok(products);
    }

    // (Tùy chọn) Lấy danh sách có phân trang
//    @GetMapping("/home/paged")
//    public ResponseEntity<Page<Product>> listProductsPaged(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size
//    ) {
//        Page<Product> paged = productService.getAllActiveProductsPaged(page, size);
//        return ResponseEntity.ok(paged);
//    }

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
    public List<Product> getProductsBySupplier(@PathVariable Integer supplierId) {
        return productService.getProductsBySupplierId(supplierId);
    }


}
