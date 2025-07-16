package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.request.chatRequest.CreateCommunityChatRequestDTO;
import com.farm.farmtrade.dto.request.chatRequest.JoinCommunityChatRequestDTO;
import com.farm.farmtrade.dto.request.chatRequest.MessageRequestDTO;
import com.farm.farmtrade.dto.response.chatResponse.ConversationResponseDTO;
import com.farm.farmtrade.dto.response.chatResponse.CreateCommunityChatResponseDTO;
import com.farm.farmtrade.dto.response.chatResponse.JoinCommunityChatResponseDTO;
import com.farm.farmtrade.dto.response.chatResponse.MessageResponseDTO;
import com.farm.farmtrade.entity.Conversation;

import com.farm.farmtrade.entity.ConversationParticipants;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.service.ConversationService;
import com.farm.farmtrade.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/conversations")
public class ConversationController {
    private final ConversationService conversationService;
    private final ProductService productService;

    @GetMapping("/{conversationId}/members")
    public ResponseEntity<List<ConversationParticipants>> getConversationMembers(@PathVariable Long conversationId) {
        List<ConversationParticipants> members = conversationService.getConversationMembers(conversationId);
        return ResponseEntity.ok(members);
    }

    public ConversationController(ConversationService conversationService, ProductService productService) {
        this.conversationService = conversationService;
        this.productService = productService;
    }
    @PostMapping("/join-community")
    public JoinCommunityChatResponseDTO joinCommunity(@RequestBody JoinCommunityChatRequestDTO request) {
        return conversationService.joinCommunityChat(request.getLatitude(), request.getLongitude(), request.getUserId());
    }

    @PostMapping("/create-community")
    public CreateCommunityChatResponseDTO createCommunity(@RequestBody CreateCommunityChatRequestDTO request) {
        return conversationService.createCommunityChat(request.getLatitude(), request.getLongitude());
    }

    @GetMapping("/existing")
    public ResponseEntity<Long> checkExistingConversation(
            @RequestParam("userID1") String userID1Str,
            @RequestParam("userID2") String userID2Str) {

        try {
            Integer userID1 = Integer.valueOf(userID1Str);
            Integer userID2 = Integer.valueOf(userID2Str);
            Long conversationId = conversationService.getExistingConversation(userID1, userID2);
            return ResponseEntity.ok(conversationId);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping
    public List<ConversationResponseDTO> getConversationsByUser(@RequestParam Integer userId) {
        return conversationService.getConversationsByUser(userId);
    }

    @PostMapping
    public ResponseEntity<ConversationResponseDTO> createConversation(@Valid @RequestBody ProductMessageRequest.ConversationRequest request) {
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

    @GetMapping("/products/supplier/{supplierId}")
    public ResponseEntity<List<Product>> getProductsBySupplierId(@PathVariable Integer supplierId) {
        List<Product> products = productService.getProductsBySupplierId(supplierId);
        return ResponseEntity.ok(products);
    }

    @PostMapping("/{conversationId}/product-message")
    public ResponseEntity<?> sendProductMessage(
            @PathVariable Long conversationId,
            @RequestBody ProductMessageRequest request) {
        try {
            conversationService.sendProductMessage(conversationId, request.getSenderId(), request.getProductId());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}
class ProductMessageRequest {
    private Integer senderId;
    private Integer productId;

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    class ConversationRequest {
        private List<Integer> userIDs;
        private boolean isGroup;
        private String name;

        // Getters and setters
        public List<Integer> getUserIDs() {
            return userIDs;
        }

        public void setUserIDs(List<Integer> userIDs) {
            this.userIDs = userIDs;
        }

        public boolean isGroup() {
            return isGroup;
        }

        public void setGroup(boolean isGroup) {
            this.isGroup = isGroup;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
