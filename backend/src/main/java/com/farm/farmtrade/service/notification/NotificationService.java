package com.farm.farmtrade.service.notification;

import com.farm.farmtrade.entity.Notification;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.NotificationRepository;
import com.farm.farmtrade.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public Notification createNotification(Integer userId, String title, String message, String type, Integer contentId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .contentID(contentId)
                .build();

        return notificationRepository.save(notification);
    }

    public Page<Notification> getNotificationsByUser(Integer userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return notificationRepository.findByUserUserID(userId, pageable);
    }


    public void markAsRead(Integer notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    public void deleteNotification(Integer notificationId) {
        if (!notificationRepository.existsById(notificationId)) {
            throw new IllegalArgumentException("Notification not found");
        }
        notificationRepository.deleteById(notificationId);
    }
}
