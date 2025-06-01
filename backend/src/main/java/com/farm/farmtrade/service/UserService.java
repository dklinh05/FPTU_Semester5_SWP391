package com.farm.farmtrade.service;

import com.cloudinary.Cloudinary;
import com.farm.farmtrade.dto.Request.ChangePasswordRequest;
import com.farm.farmtrade.dto.Request.ResetPasswordRequest;
import com.farm.farmtrade.dto.Request.UserCreationRequest;
import com.farm.farmtrade.dto.Request.UserUpdateRequest;
import com.farm.farmtrade.service.email.EmailService;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.entity.VerificationToken;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.repository.VerificationTokenRepository;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

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
            throw new RuntimeException("User already  or email is already in use. Please try again!");
        }

        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setCreatedAt(LocalDateTime.now());
        user.setAddress(request.getAddress());
        user.setRewardPoints(0);
        user.setTotalSpend(0L);
        user.setBusinessName(request.getBusinessName());
        user.setCertification(request.getCertification());
        user.setTotalRevenue(0L);
        user.setVehicle(request.getVehicle());
        user.setLicensePlate(request.getLicensePlate());

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

    public User getUser(String id) {
        return userRepository.findById(String.valueOf(Integer.valueOf(id)))
                .orElseThrow(()-> new RuntimeException("User Not Found"));
    }


    public User updateAvatar(String userId, MultipartFile file) {
        try {
            // 1. Tìm user
            Optional<User> optionalUser = userRepository.findById(userId);
            if (!optionalUser.isPresent()) {
                throw new RuntimeException("Không tìm thấy user với ID: " + userId);
            }

            User user = optionalUser.get();

            // 2. Upload file lên Cloudinary
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), Map.of(
                    "folder", "avatars",
                    "public_id", "user_" + userId,
                    "overwrite", true
            ));

            String avatarUrl = (String) uploadResult.get("secure_url");

            // 3. Cập nhật avatar URL
            user.setAvatar(avatarUrl);

            // 4. Lưu lại user
            return userRepository.save(user);

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi upload avatar: " + e.getMessage(), e);
        }
    }
    public User updateGoogleUser(String userId, UserUpdateRequest request) {
        User user = getUser(userId);
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setAddress(request.getAddress());
        user.setBusinessName(request.getBusinessName());
        user.setCertification(request.getCertification());
        user.setVehicle(request.getVehicle());
        user.setLicensePlate(request.getLicensePlate());
        return userRepository.save(user);
    }
    public User updateUser(String userId, UserUpdateRequest request) {
        User user = getUser(userId);

        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Username already taken");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already taken");
            }
            user.setEmail(request.getEmail());
        }

        return userRepository.save(user);
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

        User user = getUser(request.getUserId());
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
    @PutMapping("/{userId}/username")
    public User updateUsername(String userId, String username) {
        User user = getUser(userId);
        user.setUsername(username);
        return userRepository.save(user);
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
