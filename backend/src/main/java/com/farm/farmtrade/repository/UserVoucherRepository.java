package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.UserVoucher;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserVoucherRepository extends JpaRepository<UserVoucher, Integer> {
    // Lấy tất cả voucher của 1 user
    List<UserVoucher> findByUser(User user);
    // Tìm theo user và voucher (dành cho việc kiểm tra đã đổi hay chưa)
    Optional<UserVoucher> findByUserAndVoucher(User user, Voucher voucher);
    // Lấy tất cả chưa dùng
    List<UserVoucher> findByUserAndIsUsedFalse(User user);
    // Đếm số lượt đã dùng 1 voucher của user
    long countByVoucherAndIsUsedTrue(Voucher voucher);

    UserVoucher findByUserVoucherID(Integer userVoucherID);
}