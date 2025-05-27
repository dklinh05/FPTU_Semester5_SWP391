package com.farm.farmtrade.service;


import com.farm.farmtrade.dto.Request.AuthenticationRequest;
import com.farm.farmtrade.dto.Request.ForgotPasswordRequest;
import com.farm.farmtrade.dto.Request.SendOTPRequest;
import com.farm.farmtrade.email.EmailService;
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

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    UserService userService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    private VerificationTokenRepository verificationTokenRepository;
    @Autowired
    private EmailService emailService;

    public Integer authenticate(AuthenticationRequest request) {
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        return (passwordEncoder.matches(request.getPassword(),user.getPasswordHash())&&user.getIsActive()) ? user.getUserID() : null;

    }

    public void sendOTP(SendOTPRequest request) throws MessagingException {
        User user = userRepository.findById(Integer.valueOf(request.getUserId())).orElseThrow(() -> new RuntimeException("User not found"));

        String token = String.format("%06d", new Random().nextInt(1000000));
        saveOTPToken(user, token);
        emailService.sendResetOTP(user.getEmail(), user.getFullName(), token);
    }

    public void sendOTPForget(ForgotPasswordRequest request) throws MessagingException {
        Optional<User> user = userRepository.findByEmail(request.getEmail());

        String token = String.format("%06d", new Random().nextInt(1000000));
        saveOTPToken(user.get(), token);
        emailService.sendResetOTP(user.get().getEmail(), user.get().getFullName(), token);
    }

    public void saveOTPToken(User user, String token) {
        VerificationToken verificationToken = new VerificationToken(
                token,
                user,
                LocalDateTime.now().plusHours(1)
        );
        verificationTokenRepository.save(verificationToken);
    }
}
