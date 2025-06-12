package com.farm.farmtrade.service;


import com.farm.farmtrade.dto.request.authenticationRequest.RoleUpgradeRequest;
import com.farm.farmtrade.entity.RoleUpgrade;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.enums.Role;
import com.farm.farmtrade.exception.AppException;
import com.farm.farmtrade.exception.ErrorCode;
import com.farm.farmtrade.repository.RoleUpgradeRepository;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.service.fileStorage.FileStorageService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleUpgradeService {
    @Autowired
    RoleUpgradeRepository roleUpgradeRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    FileStorageService fileStorageService;

    //  Người dùng gửi yêu cầu nâng cấp
    public RoleUpgrade submitRequest(RoleUpgradeRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_UNEXISTED));

        if (!user.getRole().equalsIgnoreCase("CUSTOMER")) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        RoleUpgrade roleUpgrade = RoleUpgrade.builder()
                .user(user)
                .businessName(request.getBusinessName())
                .requestedRole("SUPPLIER")
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();
        fileStorageService.uploadCertificationImage(String.valueOf(request.getUserId()), request.getCertification());
        return roleUpgradeRepository.save(roleUpgrade);
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
