package com.farm.farmtrade.service;


import com.farm.farmtrade.dto.request.authenticationRequest.RoleUpgradeRequest;
import com.farm.farmtrade.entity.RoleUpgrade;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.exception.AppException;
import com.farm.farmtrade.exception.ErrorCode;
import com.farm.farmtrade.repository.RoleUpgradeRepository;
import com.farm.farmtrade.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleUpgradeService {
    @Autowired
    private final RoleUpgradeRepository roleUpgradeRepository;
    @Autowired
    private final UserRepository userRepository;

    //  Người dùng gửi yêu cầu nâng cấp
    public RoleUpgrade submitRequest(Integer userId, String requestedRole, String businessName, String certification) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_UNEXISTED));

        if (!user.getRole().equalsIgnoreCase("CUSTOMER")) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        RoleUpgrade request = RoleUpgrade.builder()
                .user(user)
                .businessName(businessName)
                .certification(certification)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        return roleUpgradeRepository.save(request);
    }

    // 2. Admin phê duyệt
    @Transactional
    public RoleUpgrade approveRequest(Integer requestId, String adminNote) {
        RoleUpgrade request = roleUpgradeRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (!request.getStatus().equals("PENDING")) {
            throw new IllegalStateException("Request already handled");
        }

        User user = request.getUser();
        user.setRole("SUPPLIER");
        user.setBusinessName(request.getBusinessName());
        user.setCertification(request.getCertification());
        userRepository.save(user);
        request.setStatus("APPROVED");
        request.setAdminNote(adminNote);
        request.setReviewedAt(LocalDateTime.now());

        return roleUpgradeRepository.save(request);
    }

    // 3. Admin từ chối
    @Transactional
    public RoleUpgrade rejectRequest(Integer requestId, String adminNote) {
        RoleUpgrade request = roleUpgradeRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (!request.getStatus().equals("PENDING")) {
            throw new IllegalStateException("Request already handled");
        }

        request.setStatus("REJECTED");
        request.setAdminNote(adminNote);
        request.setReviewedAt(LocalDateTime.now());

        return roleUpgradeRepository.save(request);
    }

    // 4. Lấy tất cả yêu cầu
    public List<RoleUpgrade> getAllRequests() {
        return roleUpgradeRepository.findAll();
    }

    // 5. Lấy các yêu cầu theo trạng thái
    public List<RoleUpgrade> getRequestsByStatus(String status) {
        return roleUpgradeRepository.findByStatus(status);
    }
}
