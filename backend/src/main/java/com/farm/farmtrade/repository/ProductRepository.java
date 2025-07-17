package com.farm.farmtrade.repository;

import com.farm.farmtrade.dto.response.adminDashboardResponse.TopProductDTO;
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
    List<Product> findBySupplier_UserID(Integer supplierId);
    // Tìm sản phẩm theo status có phân trang
    Page<Product> findPageByStatus(String status, Pageable pageable);

    List<Product> findByNameContainingIgnoreCaseAndStatus(String keyword, String status);

    Page<Product> findPageByCategoryAndStatus(String category, String status,  Pageable pageable);

    Page<Product> findBySupplierUserID(Integer supplierId, Pageable pageable);

    Page<Product> findPageBySupplierUserIDAndStatus(Integer sellerId, String status, Pageable pageable);

    Page<Product> findBySupplierUserIDAndStatusNot(Integer supplierId, String status, Pageable pageable);

    List<Product> findByNameContainingIgnoreCaseAndStatusNot(String keyword, String status);


    @Query(value = "SELECT p.Name AS name, p.Sales AS sales FROM Products p ORDER BY p.Sales DESC LIMIT 5", nativeQuery = true)
    List<TopProductDTO> findTop5Products();
}
