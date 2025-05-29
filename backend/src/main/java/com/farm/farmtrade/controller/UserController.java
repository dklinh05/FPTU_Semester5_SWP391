package com.farm.farmtrade.controller;


import com.cloudinary.Cloudinary;
import com.farm.farmtrade.dto.Request.UserCreationRequest;
import com.farm.farmtrade.dto.Request.UserUpdateRequest;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.service.UserService;
import com.farm.farmtrade.service.cloudinary.CloudinaryService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@Slf4j
@RequestMapping("/Users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private UserRepository userRepository;

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

    // @GetMapping("/{userID}")
    User getUser(@PathVariable String userID) {
        return userService.getUser(userID);
    }




//    @PostMapping("/{userID}/avatar")
//    public ResponseEntity<User> uploadAvatar(@PathVariable String userID,   @RequestPart("avatar") MultipartFile file) {
//        User updatedUser = userService.uploadAvatar(userID, file);
//        return ResponseEntity.ok(userService.uploadAvatar(userID, file));
//    }

    @PostMapping("/{userID}/avatar")
    public ResponseEntity<?> uploadAvatar(
            @PathVariable("userID") String userID,
            @RequestParam("avatar") MultipartFile file) {
        try {
            User updatedUser = userService.uploadAvatar(userID, file);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", e.getMessage()));
        }
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


    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{userId}/username")
    public ResponseEntity<User> updateUsername(
            @PathVariable String userId,
            @RequestBody Map<String, String> payload) {
        String newUsername = payload.get("username");
        User updatedUser = userService.updateUsername(userId, newUsername);
        return ResponseEntity.ok(updatedUser);
    }


}