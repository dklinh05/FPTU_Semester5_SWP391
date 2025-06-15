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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.util.*;

@RestController
@Slf4j
@RequestMapping("/users") // ←←← URL gốc thống nhất
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
        log.info("Username: " + authentication.getName());
        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));
        return userService.getAllUsers();
    }

//
//    @PutMapping("/google/{userID}")
//    User upDateGoogleUser(@PathVariable String userID,@RequestBody UserUpdateRequest request) {
//        return userService.updateGoogleUser(Integer.valueOf(userID),request);
//    }
//     @PutMapping("/{userID}")
//     User upDateUser(@PathVariable String userID,@RequestBody UserUpdateRequest request) {
//         return userService.updateUser(userID,request);
//     }


    @GetMapping("/{userID}")
    public ResponseEntity<User> getUser(@PathVariable Integer userID) {
        User user = userService.getUserById(userID);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userID}")
    public ResponseEntity<?> updateUser(@PathVariable Integer userID, @RequestBody UserUpdateRequest request) {
        boolean isUpdated = userService.updateUser(userID, request);

        Map<String, Object> response = new HashMap<>();
        if (isUpdated) {
            response.put("success", true);
            response.put("message", "Cập nhật thành công");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("error", "Không tìm thấy người dùng");
            return ResponseEntity.status(404).body(response);
        }
    }

    @Transactional
    @DeleteMapping("/{userID}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer userID) {
        Optional<User> user = userRepository.findById(userID);
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return ResponseEntity.ok("Xóa người dùng thành công");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
        }
    }

    @PostMapping("/{userId}/avatar")
    public ResponseEntity<?> uploadAvatar(@PathVariable Integer userId,
                                          @RequestParam("avatar") MultipartFile file) {
        try {
            String avatarUrl = userService.updateAvatar(userId, file);
            return ResponseEntity.ok().body(Map.of("avatarUrl", avatarUrl));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Upload avatar thất bại: " + e.getMessage()));
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

}
    // Gửi yêu cầu nâng cấp vai trò (CUSTOMER ➝ SUPPLIER)
//    @PostMapping("/request")
//    public ResponseEntity<RoleUpgrade> submitUpgradeRequest(@RequestBody RoleUpgradeRequest request) {
//        RoleUpgrade roleUpgrade = roleUpgradeService.submitRequest(request);
//        return ResponseEntity.ok(roleUpgrade);
//    }
//

