package com.farm.farmtrade.controller;


import com.farm.farmtrade.dto.request.authenticationRequest.AdminNoteRequest;
import com.farm.farmtrade.entity.RoleUpgrade;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.enums.Role;
import com.farm.farmtrade.repository.UserRepository;
import com.farm.farmtrade.service.RoleUpgradeService;
import com.farm.farmtrade.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleUpgradeService roleUpgradeService;

    //lấy toàn bộ user
    /**isActive=true → Lọc theo trạng thái tài khoản.
    role=SUPPLIER → Lọc theo vai trò.
    keyword=bill → Tìm kiếm theo tên hoặc email.
    page=0&size=10 → Phân trang.
    sort=createdAt,desc → Sắp xếp theo thời gian tạo.
    test -> GET /admin/users?isActive=true
    */
    @GetMapping("/users")
    public Page<User> getFilteredUsers(
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return userService.filterUsers(isActive, role, keyword, pageable);
    }

    @PutMapping("/users/role/{userId}")
    public ResponseEntity<?> updateSupplierRole(@PathVariable Integer userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        user.setRole(Role.SUPPLIER.name());
        userRepository.save(user);

        log.info("User role of {} has been update to SUPPLIER by admin.", user.getUsername());
        return ResponseEntity.ok("User account has been update to SUPPLIER successfully.");
    }


    //khóa tài khoản
    @PutMapping("/users/lock/{userId}")
    public ResponseEntity<?> lockUser(@PathVariable Integer userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        user.setIsLocked(true); // Tạm thời khóa tài khoản
        userRepository.save(user);

        log.info("User {} has been locked by admin.", user.getUsername());
        return ResponseEntity.ok("User account locked successfully.");
    }

    //mở khóa tài khoản
    @PutMapping("/users/unlock/{userId}")
   public ResponseEntity<?> unlockUser(@PathVariable Integer userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        user.setIsLocked(false); // Mở lại quyền truy cập
        userRepository.save(user);

        log.info("User {} has been unlocked by admin.", user.getUsername());
        return ResponseEntity.ok("User account unlocked successfully.");
    }

    // xóa tài khoản user khỏi hệ thống
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        userRepository.deleteById(userId);

        log.info("User with ID {} has been permanently deleted by admin.", userId);
        return ResponseEntity.ok("User account deleted permanently.");
    }

    /**XỬ LÝ REQUEST ROLE CỦA CUSTOMER**/
    // Admin phê duyệt request
    @PutMapping("users/request/approve")
    public ResponseEntity<RoleUpgrade> approveRequest(@RequestBody AdminNoteRequest request) {
        RoleUpgrade approved = roleUpgradeService.approveRequest(request.getRequestId(),request.getAdminNote());
        return ResponseEntity.ok(approved);
    }

    // Admin từ chối request
    @PutMapping("users/request/reject")
    public ResponseEntity<RoleUpgrade> rejectRequest(@RequestBody AdminNoteRequest request) {
        RoleUpgrade rejected = roleUpgradeService.rejectRequest(request.getRequestId(), request.getAdminNote());
        return ResponseEntity.ok(rejected);
    }

    // Lấy tất cả yêu cầu role
    @GetMapping("users/request")
    public ResponseEntity<List<RoleUpgrade>> getAllRequests() {
        return ResponseEntity.ok(roleUpgradeService.getAllRequests());
    }

    // Lọc yêu cầu theo trạng thái (PENDING, APPROVED, REJECTED)
    @GetMapping("users/request/filter/{status}")
    public ResponseEntity<List<RoleUpgrade>> getRequestsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(roleUpgradeService.getRequestsByStatus(status));
    }
}
