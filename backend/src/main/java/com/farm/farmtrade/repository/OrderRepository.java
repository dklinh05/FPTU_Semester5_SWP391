package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Order;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.entity.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByBuyer(User buyer);

    List<Order> findByOrderGroupOrderGroupID(Integer orderGroupId);

    Page<Order> findBySupplierUserIDAndStatus(Integer supplierId, String status, Pageable pageable);

    Page<Order> findBySupplierUserID(Integer supplierId, Pageable pageable);

    // Doanh thu trong ngày
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
            "WHERE DATE(o.orderDate) = :date AND o.supplier.userID = :supplierId")
    Double getRevenueByDateAndSupplier(@Param("date") LocalDate date, @Param("supplierId") Long supplierId);

    // Số đơn trong ngày
    @Query("SELECT COUNT(o) FROM Order o " +
            "WHERE DATE(o.orderDate) = :date AND o.supplier.userID = :supplierId")
    Long getOrderCountByDateAndSupplier(@Param("date") LocalDate date, @Param("supplierId") Long supplierId);

    // Doanh thu trong tháng
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
            "WHERE MONTH(o.orderDate) = :month AND YEAR(o.orderDate) = :year AND o.supplier.userID = :supplierId")
    Double getRevenueByMonthAndSupplier(@Param("month") int month, @Param("year") int year, @Param("supplierId") Long supplierId);

    // Số đơn trong tháng
    @Query("SELECT COUNT(o) FROM Order o " +
            "WHERE MONTH(o.orderDate) = :month AND YEAR(o.orderDate) = :year AND o.supplier.userID = :supplierId")
    Long getOrderCountByMonthAndSupplier(@Param("month") int month, @Param("year") int year, @Param("supplierId") Long supplierId);

}