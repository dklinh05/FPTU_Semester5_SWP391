package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.Request.*;
import com.farm.farmtrade.service.AuthenticationService;
import com.farm.farmtrade.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;
    private final UserService userService;

    @PostMapping("/login")
    Integer login(@RequestBody AuthenticationRequest request) {
        return authenticationService.authenticate(request);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        boolean verified = userService.verifyToken(token);
        if (verified) {
            return ResponseEntity.ok().header("Content-Type", "text/html").body(htmlResponse);
        } else {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Token không hợp lệ hoặc đã hết hạn.");
        }
    }


    @PostMapping("/send-otp")
    public void sendOtp(@RequestBody SendOTPRequest request) throws MessagingException {
        try {
            authenticationService.sendOTP(request);
        } catch (Exception ignored) {
            ignored.printStackTrace();
        }
    }

    @PostMapping("/send-otp-forgot")
    public void sendOtpForgot(@RequestBody ForgotPasswordRequest request) throws MessagingException {
        try {
            authenticationService.sendOTPForget(request);
        } catch (Exception ignored) {
            ignored.printStackTrace();
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OTPRequest request) {
        boolean verified = userService.verifyOTPToken(request.getToken());
        if (verified) {
            return ResponseEntity.ok("Xác minh tài khoản thành công!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token không hợp lệ hoặc đã hết hạn.");
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        try {
            userService.changePassword(request);
            return ResponseEntity.ok("Thay đổi mật khẩu thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        try {
            userService.resetPassword(request);
            return ResponseEntity.ok("Đặt lại mật khẩu thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    String htmlResponse = """
                        <html>
                        <head>
                            <script type="text/javascript">
                                alert('Your account has been successfully verified!');
                                window.location.href = 'http://localhost:5173/login';
                            </script>
                        </head>
                        <body></body>
                        </html>
                    """;
}
