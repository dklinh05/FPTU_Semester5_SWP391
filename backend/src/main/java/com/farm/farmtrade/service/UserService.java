package com.farm.farmtrade.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.farm.farmtrade.dto.request.authenticationRequest.ChangePasswordRequest;
import com.farm.farmtrade.dto.request.authenticationRequest.ResetPasswordRequest;
import com.farm.farmtrade.dto.request.authenticationRequest.UserCreationRequest;
import com.farm.farmtrade.dto.request.authenticationRequest.UserUpdateRequest;
import com.farm.farmtrade.entity.UserSpecification;
import com.farm.farmtrade.enums.Role;
import com.farm.farmtrade.exception.AppException;
import com.farm.farmtrade.exception.ErrorCode;
import com.farm.farmtrade.service.email.EmailService;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.entity.VerificationToken;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.repository.VerificationTokenRepository;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private VerificationTokenRepository verificationTokenRepository;
    @Autowired
    private EmailService emailService;
    public User createRequest(UserCreationRequest request) throws MessagingException {
        User user = new User();
        user.setIsActive(false);

        if (userRepository.existsByUsername(request.getUsername())|| userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setCreatedAt(LocalDateTime.now());
        user.setAddress(request.getAddress());
        user.setRewardPoints(0);
        user.setTotalSpend(0L);
        user.setRole(Role.CUSTOMER.name());
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));

        User savedUser = userRepository.save(user);

        String token = UUID.randomUUID().toString();
        saveVerificationToken(user, token);
        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), token);

        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUser(Integer id) {
        return userRepository.findById(Integer.valueOf(id))
                .orElseThrow(()-> new RuntimeException("User Not Found"));
    }

    public User uploadAvatar(Integer id, MultipartFile file) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            if (file.isEmpty()) {
                throw new RuntimeException("File trống hoặc không hợp lệ");
            }

            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "avatars",
                    "public_id", "user_" + id
            ));

            String avatarUrl = (String) uploadResult.get("secure_url");
            user.setAvatar(avatarUrl);
            return userRepository.save(user);

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi đọc file", e);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi upload avatar lên Cloudinary", e);
        }
    }

    public User updateGoogleUser(Integer userId, UserUpdateRequest request) {
        User user = getUser(userId);
        user.setPhone(request.getPhone());
        user.setRole(Role.CUSTOMER.name());

        user.setAddress(request.getAddress());
        user.setBusinessName(request.getBusinessName());
        user.setCertification(request.getCertification());
        user.setVehicle(request.getVehicle());
        user.setLicensePlate(request.getLicensePlate());
        return userRepository.save(user);
    }
  
    public boolean updateUser(Integer userID, UserUpdateRequest request) {
        Optional<User> userOpt = userRepository.findById(userID);

        if (userOpt.isEmpty()) {
            return false; // Người dùng không tồn tại
        }

        User user = userOpt.get();

        // Chỉ cập nhật các field có giá trị khác null hoặc không trống
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName());
        }

        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            user.setPhone(request.getPhone());
        }

        if (request.getAddress() != null && !request.getAddress().trim().isEmpty()) {
            user.setAddress(request.getAddress());
        }

        userRepository.save(user); // Lưu lại người dùng sau khi cập nhật
        return true;
    }

    public void saveVerificationToken(User user, String token) {
        VerificationToken verificationToken = new VerificationToken(
                token,
                user,
                LocalDateTime.now().plusHours(24)
        );
        verificationTokenRepository.save(verificationToken);
    }

    public boolean verifyToken(String token) {
        return verificationTokenRepository.findByToken(token).map(verificationToken -> {
            if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                return false; // Token hết hạn
            }
            User user = verificationToken.getUser();
            user.setIsActive(true); // Kích hoạt tài khoản
            userRepository.save(user);
            verificationTokenRepository.delete(verificationToken); // Xóa token đã dùng
            return true;
        }).orElse(false); // Token không tồn tại
    }

    public boolean verifyOTPToken(String token) {
        return verificationTokenRepository.findByToken(token).map(verificationToken -> {
            if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                return false; // Token hết hạn
            }
            return true;
        }).orElse(false); // Token không tồn tại
    }

    public void changePassword(ChangePasswordRequest request) {

        User user = getUser(Integer.valueOf(request.getUserId()));
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        // Verify old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid old password");
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void resetPassword(ResetPasswordRequest request) {

        Optional<VerificationToken> tokenOptional = verificationTokenRepository.findByToken(request.getToken());

        if (tokenOptional.isEmpty()) {
            throw new RuntimeException("Invalid or expired token");
        }

        VerificationToken verificationToken = tokenOptional.get();
        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            verificationTokenRepository.delete(verificationToken);
            throw new RuntimeException("Token has expired");
        }

        User user = verificationToken.getUser();
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
        verificationTokenRepository.delete(verificationToken);
    }

    public User updateEmail(String userID, String newEmail) {
        User user = userRepository.findById(Integer.valueOf(userID))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (userRepository.existsByEmail(newEmail)) {
            throw new RuntimeException("Email này đã tồn tại");
        }

        user.setEmail(newEmail);
        return userRepository.save(user);
    }
    public Page<User> filterUsers(Boolean isActive, String role, String keyword, Pageable pageable) {
        Specification<User> spec = UserSpecification.filterUsers(isActive, role, keyword);
        return userRepository.findAll(spec, pageable);
    }

}
