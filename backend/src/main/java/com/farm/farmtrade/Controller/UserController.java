package com.farm.farmtrade.Controller;


import com.farm.farmtrade.dto.Request.UserCreationRequest;
import com.farm.farmtrade.dto.Request.UserUpdateRequest;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Users")
public class UserController {
    @Autowired
    private UserService userService;


    @PostMapping
    User createUser(@RequestBody @Valid UserCreationRequest request) throws MessagingException {
        return userService.createRequest(request);
    }

    @GetMapping
    List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{userID}")
    User upDateUser(@PathVariable String userID,@RequestBody UserUpdateRequest request) {
        return userService.updateUser(userID,request);
    }

}
