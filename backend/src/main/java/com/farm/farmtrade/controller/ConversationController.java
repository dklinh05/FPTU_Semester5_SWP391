package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.request.chatRequest.ConversationRequestDTO;
import com.farm.farmtrade.dto.request.chatRequest.MessageRequestDTO;
import com.farm.farmtrade.dto.response.chatResponse.ConversationResponseDTO;
import com.farm.farmtrade.dto.response.chatResponse.MessageResponseDTO;
import com.farm.farmtrade.service.ConversationService;
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

    @PostMapping
    public Long createConversation(@Valid @RequestBody ConversationRequestDTO dto) {
        return conversationService.createConversation(dto);
    }

    @GetMapping
    public List<ConversationResponseDTO> getConversationsByUser(@RequestParam Integer userId) {
        return conversationService.getConversationsByUser(userId);
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