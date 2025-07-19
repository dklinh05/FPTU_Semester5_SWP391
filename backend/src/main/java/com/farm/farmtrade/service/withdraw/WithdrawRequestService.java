package com.farm.farmtrade.service.withdraw;

import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.entity.WithdrawRequest;
import com.farm.farmtrade.enums.Role;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.repository.WithdrawRequestRepository;
import com.farm.farmtrade.service.notification.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WithdrawRequestService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    WithdrawRequestRepository withdrawRequestRepository;
    @Autowired
    NotificationService notificationService;

    //sup gửi request
    public void requestWithdraw(int supplierId, BigDecimal amount, String bankName, String bankAccountNumber) {
        User supplier = userRepository.findById(supplierId)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found"));

        BigDecimal totalRevenue = supplier.getTotalRevenue();
        BigDecimal availableAmount = totalRevenue.multiply(BigDecimal.valueOf(0.90));

        if (amount.compareTo(totalRevenue) > 0) {
            throw new IllegalArgumentException("Requested amount exceeds withdrawable balance.");
        }

        WithdrawRequest request = WithdrawRequest.builder()
                .supplier(supplier)
                .amountRequested(amount)
                .platformFee(amount.multiply(BigDecimal.valueOf(0.10)))
                .amountApproved(amount.multiply(BigDecimal.valueOf(0.90))) // Bạn có thể tính trừ thêm phí ngân hàng nếu cần
                .status("PENDING")
                .requestDate(LocalDateTime.now())
                .bankName(bankName)
                .bankAccountNumber(bankAccountNumber)
                .build();

        withdrawRequestRepository.save(request);

        notificationService.createNotification(
                supplierId,
                "Yêu cầu rút tiền đã được gửi",
                "Yêu cầu rút số tiền " + amount + " của bạn đã được gửi và đang chờ phê duyệt.",
                "WITHDRAWAL_REQUEST"
        );
    }


    public void processWithdrawRequest(Integer requestId, String status, String note) {
        WithdrawRequest request = withdrawRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy yêu cầu rút tiền."));

        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalStateException("Yêu cầu đã được xử lý trước đó.");
        }

        User supplier = request.getSupplier();
        BigDecimal amount = request.getAmountRequested();

        request.setNote(note); // Lưu ghi chú dù là duyệt hay từ chối
        request.setProcessedDate(LocalDateTime.now());

        if ("APPROVED".equalsIgnoreCase(status)) {
            BigDecimal withdrawn = supplier.getWithdrawn() != null ? supplier.getWithdrawn() : BigDecimal.ZERO;
            supplier.setWithdrawn(withdrawn.add(amount));

            request.setStatus("APPROVED");

            userRepository.save(supplier);
            withdrawRequestRepository.save(request);

            // Gửi thông báo duyệt
            notificationService.createNotification(
                    supplier.getUserID(),
                    "Yêu cầu rút tiền đã được duyệt",
                    "Yêu cầu rút số tiền " + amount + " của bạn đã được phê duyệt. Ghi chú: " + note,
                    "WITHDRAWAL_APPROVED"
            );

        } else if ("REJECTED".equalsIgnoreCase(status)) {
            request.setStatus("REJECTED");

            withdrawRequestRepository.save(request);

            // Gửi thông báo từ chối
            notificationService.createNotification(
                    supplier.getUserID(),
                    "Yêu cầu rút tiền bị từ chối",
                    "Yêu cầu rút số tiền " + amount + " của bạn đã bị từ chối. Ghi chú: " + note,
                    "WITHDRAWAL_REJECTED"
            );

        } else {
            throw new IllegalArgumentException("Trạng thái không hợp lệ. Chỉ chấp nhận APPROVED hoặc REJECTED.");
        }
    }
}
