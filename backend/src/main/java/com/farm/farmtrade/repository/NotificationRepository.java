package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    Page<Notification> findByUserUserID(Integer userId, Pageable pageable);
}
