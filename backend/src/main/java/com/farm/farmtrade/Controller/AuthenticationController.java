package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.Request.AuthenticationRequest;
import com.farm.farmtrade.dto.Response.AuthenticationResponse;
import com.farm.farmtrade.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;

    @PostMapping("/login")
    Integer login(@RequestBody AuthenticationRequest request) {
        return authenticationService.authenticate(request);
    }

}
