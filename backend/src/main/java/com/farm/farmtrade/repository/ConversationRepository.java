package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    @Query("SELECT c.conversationId FROM Conversation c " +
            "JOIN c.conversationParticipants p " +
            "WHERE p.userId IN (:userID1, :userID2) " +
            "AND c.isGroup = false " +
            "GROUP BY c.conversationId " +
            "HAVING COUNT(DISTINCT p.userId) = 2 " +
            "ORDER BY c.createdAt DESC")
    List<Long> findConversationIdByUserIDs(@Param("userID1") Integer userID1,
                                           @Param("userID2") Integer userID2);
}