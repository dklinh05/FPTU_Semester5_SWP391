package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {}

