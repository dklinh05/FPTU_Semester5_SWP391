package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
}