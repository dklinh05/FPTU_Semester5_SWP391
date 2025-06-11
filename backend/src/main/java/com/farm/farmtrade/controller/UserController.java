package com.farm.farmtrade.controller;


import com.cloudinary.Cloudinary;
import com.farm.farmtrade.dto.request.authenticationRequest.RoleUpgradeRequest;
import com.farm.farmtrade.dto.request.authenticationRequest.UserCreationRequest;
import com.farm.farmtrade.dto.request.authenticationRequest.UserUpdateRequest;
import com.farm.farmtrade.entity.RoleUpgrade;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.service.RoleUpgradeService;
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
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleUpgradeService roleUpgradeService;

    @PostMapping("/register")
    User createUser(@RequestBody @Valid UserCreationRequest request) throws MessagingException {
        return userService.createRequest(request);
    }


    @GetMapping
    List<User> getAllUsers() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("Username: "+ authentication.getName());
        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));
        return userService.getAllUsers();
    }


    @PutMapping("/google/{userID}")
    User upDateGoogleUser(@PathVariable String userID,@RequestBody UserUpdateRequest request) {
        return userService.updateGoogleUser(Integer.valueOf(userID),request);
    }
//     @PutMapping("/{userID}")
//     User upDateUser(@PathVariable String userID,@RequestBody UserUpdateRequest request) {
//         return userService.updateUser(userID,request);
//     }

    @GetMapping("/{userID}")
    User getUser(@PathVariable String userID) {
        return userService.getUser(Integer.valueOf(userID));
    }


    @PutMapping("/{userID}")
    public ResponseEntity<?> updateUser(
            @PathVariable String userID,
            @RequestBody UserUpdateRequest request) {

        // Gọi service để cập nhật người dùng
        boolean isUpdated = userService.updateUser(Integer.valueOf(userID), request);

        if (isUpdated) {
            return ResponseEntity.ok().build(); // Thành công
        } else {
            return ResponseEntity.notFound().build(); // Không tìm thấy người dùng
        }
    }


    @Transactional
    @DeleteMapping("/{userID}")
    public ResponseEntity<User> deleteUser(@PathVariable String userID) {
        Optional<User> user = userRepository.findById(Integer.valueOf(userID));
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{userID}/avatar")
    public ResponseEntity<?> uploadAvatar(
            @PathVariable("userID") String userID,
            @RequestParam("avatar") MultipartFile file) {
        try {
            User updatedUser = userService.uploadAvatar(Integer.valueOf(userID), file);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    public User updateAvatar(String userId, MultipartFile file) {
        try {
            // 1. Tìm user
            Optional<User> optionalUser = userRepository.findById(Integer.valueOf(userId));
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

    // Gửi yêu cầu nâng cấp vai trò (CUSTOMER ➝ SUPPLIER)
    @PostMapping("/request")
    public ResponseEntity<RoleUpgrade> submitUpgradeRequest(@RequestBody RoleUpgradeRequest request) {
        RoleUpgrade roleUpgrade = roleUpgradeService.submitRequest(request);
        return ResponseEntity.ok(roleUpgrade);
    }


}