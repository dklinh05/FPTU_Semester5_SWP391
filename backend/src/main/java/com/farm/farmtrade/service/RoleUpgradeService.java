package com.farm.farmtrade.service;


import com.farm.farmtrade.dto.request.authenticationRequest.RoleUpgradeRequest;
import com.farm.farmtrade.entity.RoleUpgrade;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.enums.Role;
import com.farm.farmtrade.exception.AppException;
import com.farm.farmtrade.exception.ErrorCode;
import com.farm.farmtrade.repository.RoleUpgradeRepository;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.service.cloudinary.CloudinaryService;
import com.farm.farmtrade.service.fileStorage.FileStorageService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    // Lấy tất cả yêu cầu đang PENDING
    public List<RoleUpgrade> getPendingRequests() {
        return roleUpgradeRepository.findByStatus("PENDING");
    }
    public RoleUpgrade submitRequest(Integer userId, String businessName, MultipartFile certification) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_UNEXISTED));

        if (!user.getRole().equalsIgnoreCase("CUSTOMER")) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String certificationUrl = null;
        try {
            certificationUrl = fileStorageService.uploadCertificationImage(String.valueOf(userId), certification);
        } catch (Exception e) {
            // Bắt mọi lỗi từ Cloudinary hoặc fileStorageService
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }

        return roleUpgradeRepository.save(RoleUpgrade.builder()
                .user(user)
                .businessName(businessName)
                .certification(certificationUrl)
                .requestedRole("SUPPLIER")
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build());
    }

    @Transactional
    public RoleUpgrade approveRequest(Integer requestId, String adminNote) {
        RoleUpgrade request = roleUpgradeRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_FOUND));

        if (!request.getStatus().equals("PENDING")) {
            throw new IllegalStateException("Yêu cầu đã được xử lý");
        }

        User user = request.getUser();
        user.setRole("SUPPLIER");
        user.setBusinessName(request.getBusinessName());
        user.setCertification(request.getCertification());

        request.setStatus("APPROVED");
        request.setAdminNote(adminNote);
        request.setReviewedAt(LocalDateTime.now());

        userRepository.save(user);
        return roleUpgradeRepository.save(request);
    }

    // Admin từ chối yêu cầu
    @Transactional
    public RoleUpgrade denyRequest(Integer requestId, String adminNote) {
        RoleUpgrade request = roleUpgradeRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_FOUND));

        if (!request.getStatus().equals("PENDING")) {
            throw new IllegalStateException("Yêu cầu đã được xử lý");
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


//    // 2. Admin phê duyệt
//    @Transactional
//    public RoleUpgrade approveRequest(Integer requestId, String adminNote) {
//        RoleUpgrade request = roleUpgradeRepository.findById(requestId)
//                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
//
//        if (!request.getStatus().equals("PENDING")) {
//            throw new IllegalStateException("Request already handled");
//        }
//
//        User user = request.getUser();
//        user.setRole("SUPPLIER");
//        user.setBusinessName(request.getBusinessName());
//        user.setCertification(request.getCertification());
//        userRepository.save(user);
//        request.setStatus("APPROVED");
//        request.setAdminNote(adminNote);
//        request.setReviewedAt(LocalDateTime.now());
//
//        return roleUpgradeRepository.save(request);
//    }
//
//    // 3. Admin từ chối
//    @Transactional
//    public RoleUpgrade rejectRequest(Integer requestId, String adminNote) {
//        RoleUpgrade request = roleUpgradeRepository.findById(requestId)
//                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
//
//        if (!request.getStatus().equals("PENDING")) {
//            throw new IllegalStateException("Request already handled");
//        }
//
//        request.setStatus("REJECTED");
//        request.setAdminNote(adminNote);
//        request.setReviewedAt(LocalDateTime.now());
//
//        return roleUpgradeRepository.save(request);
//    }