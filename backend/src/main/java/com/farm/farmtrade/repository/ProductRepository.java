package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    Page<Product>  findBySupplierUserIDAndStatus(Integer supplierId, String status, Pageable pageable);
    // Tìm tất cả sản phẩm theo status (không phân trang)
    List<Product> findAllByStatus(String status);

    // Tìm sản phẩm theo status có phân trang
    Page<Product> findPageByStatus(String status, Pageable pageable);

    //    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
//    List<Product> findProductsByName(@Param("keyword") String keyword);
    List<Product> findByNameContainingIgnoreCaseAndStatus(String keyword, String status);
    List<Product> findByNameContainingIgnoreCase(String keyword);

    Page<Product> findPageByCategoryAndStatus(String category, String status,  Pageable pageable);

    Page<Product> findBySupplierUserID(Integer supplierId, Pageable pageable);


}
