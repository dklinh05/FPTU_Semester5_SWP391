package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {}
