package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.Request.AuthenticationRequest;
import com.farm.farmtrade.dto.Response.AuthenticationResponse;
import com.farm.farmtrade.service.AuthenticationService;
import com.farm.farmtrade.service.UserService;
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
            return ResponseEntity.ok("Xác minh tài khoản thành công!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token không hợp lệ hoặc đã hết hạn.");
        }
    }
}
