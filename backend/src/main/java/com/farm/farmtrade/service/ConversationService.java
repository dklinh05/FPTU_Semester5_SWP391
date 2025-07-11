package com.farm.farmtrade.service;

import com.farm.farmtrade.dto.request.chatRequest.MessageRequestDTO;
import com.farm.farmtrade.dto.response.chatResponse.ConversationResponseDTO;
import com.farm.farmtrade.dto.response.chatResponse.MessageResponseDTO;
import com.farm.farmtrade.entity.Conversation;
import com.farm.farmtrade.entity.ConversationParticipants; // Sử dụng lại
import com.farm.farmtrade.entity.Message;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.ConversationParticipantsRepository; // Sử dụng lại
import com.farm.farmtrade.repository.ConversationRepository;
import com.farm.farmtrade.repository.MessageRepository;
import com.farm.farmtrade.repository.UserRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final ConversationParticipantsRepository conversationParticipantsRepository; // Sử dụng lại
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public ConversationService(ConversationRepository conversationRepository,
                               ConversationParticipantsRepository conversationParticipantsRepository, // Sử dụng lại
                               MessageRepository messageRepository,
                               UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.conversationParticipantsRepository = conversationParticipantsRepository; // Sử dụng lại
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public Long getExistingConversation(Integer userID1, Integer userID2) {
        return conversationRepository.findConversationIdByUserIDs(userID1, userID2);
    }

    @Transactional
    public Conversation createConversation(List<Integer> userIDs, boolean isGroup, String name) {
        // Tạo mới đối tượng Conversation
        Conversation conversation = new Conversation();
        conversation.setName(name);
        conversation.setGroup(isGroup);
        conversation.setCreatedAt(LocalDateTime.now());

        // Lưu Conversation vào cơ sở dữ liệu
        Conversation savedConversation = conversationRepository.save(conversation);

        // Thêm các thành viên vào ConversationParticipants
        for (Integer userId : userIDs) {
            ConversationParticipants participant = new ConversationParticipants();
            participant.setConversationId(savedConversation.getConversationId());
            participant.setUserId(userId);
            // Đặt role: người đầu tiên trong danh sách là Admin, các người khác là Member
            participant.setRole(userId.equals(userIDs.get(0)) ? ConversationParticipants.ParticipantRole.Admin : ConversationParticipants.ParticipantRole.Member);
            participant.setJoinedAt(LocalDateTime.now());
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