package com.farm.farmtrade.service.google;

import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.service.AuthenticationService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;

    public OAuth2SuccessHandler(UserRepository userRepository,AuthenticationService authenticationService) {
        this.userRepository = userRepository;
        this.authenticationService = authenticationService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            var token = authenticationService.generateToken(user);
            // Tạo cookie chứa token
            ResponseCookie cookie = ResponseCookie.from("accessToken", token)
                    .httpOnly(false)
                    .secure(false)
                    .path("/")
                    .maxAge(Duration.ofDays(7))
                    .sameSite("Lax")
                    .build();
            // Gửi cookie về client
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            response.sendRedirect("http://localhost:5173/profile");
        } else {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found in DB");
        }
    }
}
