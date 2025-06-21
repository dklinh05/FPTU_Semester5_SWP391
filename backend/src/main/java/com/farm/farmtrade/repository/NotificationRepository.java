package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserUserIDOrderByCreatedAtDesc(Integer userUserID);
}
