package com.farm.farmtrade.service.voucher;

import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.entity.UserVoucher;
import com.farm.farmtrade.entity.Voucher;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.repository.UserVoucherRepository;
import com.farm.farmtrade.repository.VoucherRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserVoucherService {

    private final UserVoucherRepository userVoucherRepository;
    private final UserRepository userRepository;
    private final VoucherRepository voucherRepository;

    /**
     * Người dùng đổi voucher (nếu đủ điểm và chưa đổi trước đó)
     */
    @Transactional
    public UserVoucher redeemVoucher(String userId, String voucherId) {
        User user = userRepository.findById(Integer.valueOf(userId))
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        Voucher voucher = voucherRepository.findById(Integer.valueOf(voucherId))
                .orElseThrow(() -> new IllegalArgumentException("Voucher not found with ID: " + voucherId));

        // Kiểm tra đã đổi và chưa sử dụng chưa
        if (userVoucherRepository.findByUserAndVoucherAndIsUsedFalse(user, voucher).isPresent()) {
            throw new IllegalArgumentException("User already redeemed this voucher and hasn't used it yet");
        }

        // Kiểm tra điểm
        if (voucher.getRequiredPoints() != null && voucher.getRequiredPoints() > 0 &&
                (user.getRewardPoints() == null || user.getRewardPoints() < voucher.getRequiredPoints())) {
            throw new IllegalArgumentException("Not enough reward points");
        }

        // Trừ điểm
        if (voucher.getRequiredPoints() != null && voucher.getRequiredPoints() > 0) {
            user.setRewardPoints(user.getRewardPoints() - voucher.getRequiredPoints());
            userRepository.save(user);
        }

        // Tạo bản ghi UserVoucher
        UserVoucher userVoucher = UserVoucher.builder()
                .user(user)
                .voucher(voucher)
                .isUsed(false)
                .build();

        return userVoucherRepository.save(userVoucher);
    }


    /**
     * Lấy tất cả voucher của người dùng
     */
    public List<UserVoucher> getVouchersByUser(String userId) {
        User user = userRepository.findById(Integer.valueOf(userId))
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        return userVoucherRepository.findByUser(user);
    }

    /**
     * Đánh dấu voucher đã dùng sau khi thanh toán
     */
    @Transactional
    public void markVoucherAsUsed(User user, Voucher voucher) {
        UserVoucher userVoucher = userVoucherRepository.findByUserAndVoucher(user, voucher)
                .orElseThrow(() -> new IllegalArgumentException("Voucher was not redeemed by this user"));

        if (userVoucher.getIsUsed()) {
            throw new IllegalStateException("Voucher already used");
        }

        userVoucher.setIsUsed(true);
        userVoucherRepository.save(userVoucher);
    }

    public List<UserVoucher> getUserVouchersByUserAndUsage(Integer userId, boolean isUsed) {
        return userVoucherRepository.findByUserUserIDAndIsUsed(userId, isUsed);
    }
}
