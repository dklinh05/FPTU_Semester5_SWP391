package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.request.chatRequest.MessageRequestDTO;
import com.farm.farmtrade.dto.response.chatResponse.ConversationResponseDTO;
import com.farm.farmtrade.dto.response.chatResponse.MessageResponseDTO;
import com.farm.farmtrade.entity.Conversation;

import com.farm.farmtrade.service.ConversationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/conversations")
public class ConversationController {
    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }
    @GetMapping("/existing")
    public ResponseEntity<Long> checkExistingConversation(
            @RequestParam("userID1") Integer userID1,
            @RequestParam("userID2") Integer userID2) {
        Long conversationId = conversationService.getExistingConversation(userID1, userID2);
        return ResponseEntity.ok(conversationId); // Returns null if no conversation exists
    }

    @GetMapping
    public List<ConversationResponseDTO> getConversationsByUser(@RequestParam Integer userId) {
        return conversationService.getConversationsByUser(userId);
    }

    @PostMapping
    public ResponseEntity<ConversationResponseDTO> createConversation(@Valid @RequestBody ConversationRequest request) {
        Conversation conversation = conversationService.createConversation(
                request.getUserIDs(),
                request.isGroup(),
                request.getName()
        );
        return ResponseEntity.ok(new ConversationResponseDTO(conversation.getConversationId(), request.getUserIDs(), request.isGroup(), request.getName()));
    }

    @PostMapping("/{conversationId}/messages")
    public Long sendMessage(@PathVariable Long conversationId, @Valid @RequestBody MessageRequestDTO dto) {
        if (!conversationId.equals(dto.getConversationId())) {
            throw new IllegalArgumentException("Conversation ID mismatch");
        }
        return conversationService.sendMessage(dto);
    }

    @GetMapping("/{conversationId}/messages")
    public List<MessageResponseDTO> getMessagesByConversation(@PathVariable Long conversationId) {
        return conversationService.getMessagesByConversation(conversationId);
    }
}

class ConversationRequest {
    private List<Integer> userIDs;
    private boolean isGroup;
    private String name;

    // Getters and setters
    public List<Integer> getUserIDs() { return userIDs; }
    public void setUserIDs(List<Integer> userIDs) { this.userIDs = userIDs; }
    public boolean isGroup() { return isGroup; }
    public void setGroup(boolean isGroup) { this.isGroup = isGroup; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

