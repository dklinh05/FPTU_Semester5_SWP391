package com.farm.farmtrade.controller;


import com.cloudinary.Cloudinary;
import com.farm.farmtrade.dto.Request.UserCreationRequest;
import com.farm.farmtrade.dto.Request.UserUpdateRequest;
import com.farm.farmtrade.dto.Response.ApiResponse;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.service.UserService;
import com.farm.farmtrade.service.cloudinary.CloudinaryService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
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

    @PostMapping("/register")
    User createUser(@RequestBody @Valid UserCreationRequest request) throws MessagingException {
        return userService.createRequest(request);
    }

//    ApiResponse<User> createUser(@RequestBody @Valid UserCreationRequest request) throws MessagingException {
//        ApiResponse<User> apiResponse = new ApiResponse<>();
//
//        apiResponse.setResult(userService.createRequest(request));
//
//        return apiResponse;
//    }


    @GetMapping
    List<User> getAllUsers() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("Username: "+ authentication.getName());
        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));
        return userService.getAllUsers();
    }

    @PutMapping("/google/{userID}")
    User upDateGoogleUser(@PathVariable String userID,@RequestBody UserUpdateRequest request) {
        return userService.updateGoogleUser(userID,request);
    }
    @PutMapping("/{userID}")
    User upDateUser(@PathVariable String userID,@RequestBody UserUpdateRequest request) {
        return userService.updateUser(userID,request);
    }

    @GetMapping("/{userID}")
    User getUser(@PathVariable String userID) {
        return userService.getUser(userID);
    }

    @Transactional
    @DeleteMapping("/{userID}")
    public ResponseEntity<User> deleteUser(@PathVariable Integer userID) {
        Optional<User> user = userRepository.findById(String.valueOf(userID));
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

//     @PutMapping("/{userID}")
//     public ResponseEntity<User> updateUser(
//             @PathVariable("userID") String userID,
//             @RequestBody UserUpdateRequest request) {
//         return ResponseEntity.ok(userService.updateUser(userID, request));
//     }
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

}