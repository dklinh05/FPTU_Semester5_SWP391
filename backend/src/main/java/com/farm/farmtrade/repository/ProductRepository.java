package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findBySupplierUserID(Integer supplierId);
    // Tìm tất cả sản phẩm theo status (không phân trang)
    List<Product> findAllByStatus(String status);

    // Tìm sản phẩm theo status có phân trang
    Page<Product> findPageByStatus(String status, Pageable pageable);


}
