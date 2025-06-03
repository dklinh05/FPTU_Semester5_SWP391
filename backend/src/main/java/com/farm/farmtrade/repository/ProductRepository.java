package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
//    List<Product> findBySupplier_Id(Integer supplierId);
}
