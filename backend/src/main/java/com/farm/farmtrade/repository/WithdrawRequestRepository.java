package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.WithdrawRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WithdrawRequestRepository extends JpaRepository<WithdrawRequest, Integer> {
    Page<WithdrawRequest> findByStatus(String status, Pageable pageable);

    Page<WithdrawRequest> findBySupplierUserID(Integer supplierId, Pageable pageable);

    Page<WithdrawRequest> findByStatusAndSupplierUserID(String status, Integer supplierId, Pageable pageable);
}
