package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.ConversationParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipant, Long> {
    boolean existsByConversationIdAndUserId(Long conversationId, Integer userId);

    @Query("SELECT cp.userId FROM ConversationParticipant cp WHERE cp.conversationId = :conversationId")
    List<Integer> findUserIdsByConversationId(Long conversationId);
}