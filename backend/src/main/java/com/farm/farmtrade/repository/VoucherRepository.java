package com.farm.farmtrade.repository;


import com.farm.farmtrade.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    Optional<Voucher> findById(Integer VoucherId);
    boolean existsByCode(String code);
}
