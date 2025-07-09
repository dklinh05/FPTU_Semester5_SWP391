package com.farm.farmtrade.service;

import com.farm.farmtrade.dto.request.chatRequest.ConversationRequestDTO;
import com.farm.farmtrade.dto.request.chatRequest.MessageRequestDTO;
import com.farm.farmtrade.dto.response.chatResponse.ConversationResponseDTO;
import com.farm.farmtrade.dto.response.chatResponse.MessageResponseDTO;
import com.farm.farmtrade.entity.Conversation;
import com.farm.farmtrade.entity.ConversationParticipant;
import com.farm.farmtrade.entity.Message;
import com.farm.farmtrade.repository.ConversationParticipantRepository;
import com.farm.farmtrade.repository.ConversationRepository;
import com.farm.farmtrade.repository.MessageRepository;
import com.farm.farmtrade.repository.UserRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository conversationParticipantRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public ConversationService(ConversationRepository conversationRepository,
                               ConversationParticipantRepository conversationParticipantRepository,
                               MessageRepository messageRepository,
                               UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.conversationParticipantRepository = conversationParticipantRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Long createConversation(ConversationRequestDTO dto) {
        if (dto.getUserIds() == null || dto.getUserIds().isEmpty()) {
            throw new IllegalArgumentException("At least one user ID is required");
        }
        if (!dto.isGroup() && dto.getUserIds().size() != 2) {
            throw new IllegalArgumentException("One-on-one conversations must have exactly two users");
        }
        if (dto.isGroup() && (dto.getName() == null || dto.getName().isEmpty())) {
            throw new IllegalArgumentException("Group conversations must have a name");
        }
        for (Integer userId : dto.getUserIds()) {
            if (!userRepository.existsById(userId)) {
                throw new IllegalArgumentException("User ID " + userId + " does not exist");
            }
        }

        Conversation conversation = new Conversation();
        conversation.setIsGroup(dto.isGroup());
        conversation.setName(dto.getName());
        Conversation savedConversation = conversationRepository.save(conversation);

        for (Integer userId : dto.getUserIds()) {
            ConversationParticipant participant = new ConversationParticipant();
            participant.setConversationId(savedConversation.getConversationId());
            participant.setUserId(userId);
            participant.setRole(userId.equals(dto.getUserIds().get(0)) ? ConversationParticipant.ParticipantRole.Admin : ConversationParticipant.ParticipantRole.Member);
            conversationParticipantRepository.save(participant);
        }

        return savedConversation.getConversationId();
    }

    @Transactional
    public Long sendMessage(MessageRequestDTO dto) {
        if (!conversationRepository.existsById(dto.getConversationId())) {
            throw new IllegalArgumentException("Conversation not found");
        }
        if (!conversationParticipantRepository.existsByConversationIdAndUserId(dto.getConversationId(), dto.getUserId())) {
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

        List<ConversationParticipant> participants = conversationParticipantRepository.findAll()
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
            dto.setUserIds(conversationParticipantRepository.findUserIdsByConversationId(conversation.getConversationId()));
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