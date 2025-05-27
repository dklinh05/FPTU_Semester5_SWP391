package com.farm.farmtrade.service;

import com.farm.farmtrade.dto.Request.*;
import com.farm.farmtrade.email.EmailService;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.entity.VerificationToken;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.repository.VerificationTokenRepository;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VerificationTokenRepository verificationTokenRepository;
    @Autowired
    private EmailService emailService;

    public User createRequest(UserCreationRequest request) throws MessagingException {
        User user = new User();
        user.setIsActive(false);

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("User already exists");
        }

        user.setUsername(request.getUsername());
        user.setPasswordHash(request.getPasswordHash());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());

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
        return userRepository.findById(Integer.valueOf(id))
                .orElseThrow(()-> new RuntimeException("User Not Found"));
    }

    public User updateUser(String userId, UserUpdateRequest request) {
        User user = getUser(userId);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());

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

}
