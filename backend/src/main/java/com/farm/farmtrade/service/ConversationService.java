package com.farm.farmtrade.service;

import com.farm.farmtrade.dto.request.chatRequest.MessageRequestDTO;
import com.farm.farmtrade.dto.response.chatResponse.ConversationResponseDTO;
import com.farm.farmtrade.dto.response.chatResponse.MessageResponseDTO;
import com.farm.farmtrade.dto.response.chatResponse.SupplierDTO;
import com.farm.farmtrade.entity.Conversation;
import com.farm.farmtrade.entity.ConversationParticipants;
import com.farm.farmtrade.entity.Message;
import com.farm.farmtrade.repository.ConversationParticipantsRepository;
import com.farm.farmtrade.repository.ConversationRepository;
import com.farm.farmtrade.repository.MessageRepository;
import com.farm.farmtrade.repository.UserRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final ConversationParticipantsRepository conversationParticipantsRepository; // Sử dụng lại
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public ConversationService(ConversationRepository conversationRepository,
                               ConversationParticipantsRepository conversationParticipantsRepository, // Sử dụng lại
                               MessageRepository messageRepository,
                               UserRepository userRepository, UserService userService) {
        this.conversationRepository = conversationRepository;
        this.conversationParticipantsRepository = conversationParticipantsRepository; // Sử dụng lại
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public Conversation createOrUpdateGroupConversation(String district, List<Integer> userIds, double lat, double lng) {
        // Tìm nhóm chat hiện có cho khu vực
        Conversation existingConversation = conversationRepository.findByName(district);

        if (existingConversation == null) {
            existingConversation = new Conversation();
            existingConversation.setName(district);
            existingConversation.setGroup(true);
            existingConversation.setCreatedAt(LocalDateTime.now());
            existingConversation = conversationRepository.save(existingConversation);
        }

        // Lấy danh sách SUPPLIER trong khu vực
        List<SupplierDTO> suppliersInDistrict = userService.getSuppliersByLocation(lat, lng);

        // Trích xuất userId từ SupplierDTO
        List<Integer> supplierIds = suppliersInDistrict.stream()
                .map(SupplierDTO::getUserId)
                .collect(Collectors.toList());

        // Kết hợp với userIds được truyền vào
        List<Integer> allUserIds = new ArrayList<>(userIds);
        allUserIds.addAll(supplierIds);

        // Thêm người dùng vào nhóm chat nếu chưa tồn tại
        for (Integer userId : allUserIds) {
            boolean exists = conversationParticipantsRepository.existsByConversationAndUserId(existingConversation, userId);
            if (!exists) {
                ConversationParticipants participant = new ConversationParticipants();
                participant.setConversation(existingConversation);
                participant.setUserId(userId);
                participant.setRole(ConversationParticipants.ParticipantRole.Member);
                conversationParticipantsRepository.save(participant);
            }
        }

        return existingConversation;
    }

    public Long getExistingConversation(Integer userID1, Integer userID2) {
        List<Long> results = conversationRepository.findConversationIdByUserIDs(userID1, userID2);
        return results.isEmpty() ? null : results.get(0);
    }

    @Transactional
    public Conversation createConversation(List<Integer> userIDs, boolean isGroup, String name) {
        Conversation conversation = new Conversation();
        conversation.setName(name);
        conversation.setGroup(isGroup);
        conversation.setCreatedAt(LocalDateTime.now());

        Conversation savedConversation = conversationRepository.save(conversation);

        for (Integer userId : userIDs) {
            ConversationParticipants participant = new ConversationParticipants();
            participant.setConversation(savedConversation);
            participant.setUserId(userId);
            participant.setRole(userId.equals(userIDs.get(0)) ? ConversationParticipants.ParticipantRole.Admin : ConversationParticipants.ParticipantRole.Member);
            participant.setJoinedAt(LocalDateTime.now());

            // Quan trọng: gán conversationId thủ công nếu dùng insertable=false
            participant.setConversationId(savedConversation.getConversationId());

            conversationParticipantsRepository.save(participant);
        }

        return savedConversation;
    }

    @Transactional
    public Long sendMessage(MessageRequestDTO dto) {
        if (!conversationRepository.existsById(dto.getConversationId())) {
            throw new IllegalArgumentException("Conversation not found");
        }
        if (!conversationParticipantsRepository.existsByConversationIdAndUserId(dto.getConversationId(), dto.getUserId())) {
            throw new IllegalArgumentException("User is not part of this conversation");
        }
        if (!userRepository.existsById(dto.getUserId())) {
            throw new IllegalArgumentException("User ID " + dto.getUserId() + " does not exist");
        }

        Message message = new Message();
        message.setConversationId(dto.getConversationId());
        message.setSenderId(dto.getUserId());
        message.setContent(dto.getContent());
        message.setRead(false);

        Message savedMessage = messageRepository.save(message);
        return savedMessage.getMessageId();
    }

    public List<ConversationResponseDTO> getConversationsByUser(Integer userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User ID " + userId + " does not exist");
        }

        List<ConversationParticipants> participants = conversationParticipantsRepository.findAll()
                .stream()
                .filter(p -> p.getUserId().equals(userId))
                .collect(Collectors.toList());

        return participants.stream().map(p -> {
            Conversation conversation = conversationRepository.findById(p.getConversationId()).orElseThrow();
            ConversationResponseDTO dto = new ConversationResponseDTO();
            dto.setConversationId(conversation.getConversationId());
            dto.setName(conversation.getName());
            dto.setIsGroup(conversation.isGroup());
            dto.setCreatedAt(conversation.getCreatedAt());
            dto.setUserIds(conversationParticipantsRepository.findUserIdsByConversationId(conversation.getConversationId()));
            return dto;
        }).collect(Collectors.toList());
    }

    public List<MessageResponseDTO> getMessagesByConversation(Long conversationId) {
        if (!conversationRepository.existsById(conversationId)) {
            throw new IllegalArgumentException("Conversation not found");
        }

        return messageRepository.findAll()
                .stream()
                .filter(m -> m.getConversationId().equals(conversationId))
                .map(m -> {
                    MessageResponseDTO dto = new MessageResponseDTO();
                    dto.setMessageId(m.getMessageId());
                    dto.setConversationId(m.getConversationId());
                    dto.setSenderId(m.getSenderId());
                    dto.setContent(m.getContent());
                    dto.setSentAt(m.getSentAt());
                    dto.setRead(m.isRead());
                    return dto;
                }).collect(Collectors.toList());
    }
}