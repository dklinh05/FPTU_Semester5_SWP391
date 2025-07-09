package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}