package com.farm.farmtrade.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "Hello, Welcome to Farm Trade";
    }

    @GetMapping("/secured")
    public String secured() {
        return "Hello, Welcome to Secured Farm Trade";
    }
}
