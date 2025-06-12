package com.farm.farmtrade.service;


import com.farm.farmtrade.dto.request.authenticationRequest.AuthenticationRequest;
import com.farm.farmtrade.dto.request.authenticationRequest.ForgotPasswordRequest;
import com.farm.farmtrade.dto.request.authenticationRequest.IntrospectRequest;
import com.farm.farmtrade.dto.request.authenticationRequest.SendOTPRequest;

import com.farm.farmtrade.dto.response.AuthenticationResponse;
import com.farm.farmtrade.dto.response.IntrospectResponse;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.entity.VerificationToken;
import com.farm.farmtrade.enums.Role;
import com.farm.farmtrade.exception.AppException;
import com.farm.farmtrade.exception.ErrorCode;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.repository.VerificationTokenRepository;
import com.farm.farmtrade.service.email.EmailService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;
import java.util.Random;
import java.util.StringJoiner;

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

        return (passwordEncoder.matches(request.getPassword(), user.getPasswordHash()) && user.getIsActive()) ? user.getUserID() : null;
    }

    public void sendOTP(SendOTPRequest request) throws MessagingException {
        User user = userRepository.findById((Integer.valueOf(request.getUserId()))).orElseThrow(() -> new RuntimeException("User not found"));

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

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    public IntrospectResponse introspect(IntrospectRequest request)
            throws JOSEException, ParseException {
        var token = request.getToken();

        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        return IntrospectResponse.builder()
                .valid(verified && expiryTime.after(new Date()))
                .build();
    }

    public AuthenticationResponse authenticateNEW(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_UNEXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(),
                user.getPasswordHash());

        if (!authenticated||user.getIsLocked())
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    public String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("farmTrade.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()
                ))
                .claim("userId", user.getUserID())
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        String role = user.getRole();

        stringJoiner.add(Role.CUSTOMER.name());

        switch (role) {
            case "SUPPLIER" -> stringJoiner.add(Role.SUPPLIER.name());
            case "ADMIN" -> {
                stringJoiner.add(Role.SUPPLIER.name());
                stringJoiner.add(Role.ADMIN.name());
            }
        }
        return stringJoiner.toString();
    }
}
