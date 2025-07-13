package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Conversation;
import com.farm.farmtrade.entity.ConversationParticipants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ConversationParticipantsRepository extends JpaRepository<ConversationParticipants, Long> {
    boolean existsByConversationIdAndUserId(Long conversationId, Integer userId);
    List<ConversationParticipants> findByConversationId(Long conversationId);
    @Query("SELECT cp.userId FROM ConversationParticipants cp WHERE cp.conversationId = :conversationId")
    List<Integer> findUserIdsByConversationId(@Param("conversationId") Long conversationId);
    boolean existsByConversationAndUserId(Conversation conversation, Integer userId);
}