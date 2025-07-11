package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    @Query("SELECT c.conversationId FROM Conversation c " +
            "JOIN ConversationParticipants cp1 ON c.conversationId = cp1.conversationId " +
            "JOIN ConversationParticipants cp2 ON c.conversationId = cp2.conversationId " +
            "WHERE cp1.userId = :userID1 AND cp2.userId = :userID2 AND c.isGroup = false " +
            "GROUP BY c.conversationId HAVING COUNT(DISTINCT cp1.userId, cp2.userId) = 2")
    Long findConversationIdByUserIDs(@Param("userID1") Integer userID1, @Param("userID2") Integer userID2);
}