package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.request.notification.NotificationRequest;
import com.farm.farmtrade.entity.Notification;
import com.farm.farmtrade.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody NotificationRequest request) {
        return ResponseEntity.ok(notificationService.createNotification(request.getUserId(), request.getTitle(), request.getMessage(), request.getType(), request.getContentId()));
    }

    @GetMapping("{userId}")
    public ResponseEntity<Page<Notification>> getNotificationsByUser(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(notificationService.getNotificationsByUser(userId, page, size));
    }


    @PutMapping("/read/{id}")
    public ResponseEntity<Void> markAsRead(@PathVariable Integer id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Integer id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}
