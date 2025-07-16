package com.farm.farmtrade.service;

import com.farm.farmtrade.dto.request.chatRequest.MessageRequestDTO;
import com.farm.farmtrade.dto.response.chatResponse.ConversationResponseDTO;
import com.farm.farmtrade.dto.response.chatResponse.CreateCommunityChatResponseDTO;
import com.farm.farmtrade.dto.response.chatResponse.JoinCommunityChatResponseDTO;
import com.farm.farmtrade.dto.response.chatResponse.MessageResponseDTO;
import com.farm.farmtrade.entity.*;
import com.farm.farmtrade.repository.*;
import com.farm.farmtrade.service.geoLocation.GeocodingService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final ConversationParticipantsRepository conversationParticipantsRepository; // Sử dụng lại
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    GeocodingService geo = new GeocodingService();
    @PersistenceContext
    private EntityManager entityManager;
    public ConversationService(ConversationRepository conversationRepository,
                               ConversationParticipantsRepository conversationParticipantsRepository, // Sử dụng lại
                               MessageRepository messageRepository,
                               UserRepository userRepository, ProductRepository productRepository, UserService userService) {
        this.conversationRepository = conversationRepository;
        this.conversationParticipantsRepository = conversationParticipantsRepository; // Sử dụng lại
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.userService = userService;
    }
    @Transactional
    public void sendProductMessage(Long conversationId, Integer senderId, Integer productId) {
        User user = userRepository.findByUserID(senderId.intValue());
        if (user == null || !"SUPPLIER".equals(user.getRole())) {
            throw new IllegalArgumentException("Only users with SUPPLIER role can send products");
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        if (!product.getSupplier().getUserID().equals(senderId.intValue())) {
            throw new IllegalArgumentException("SupplierID does not match senderId");
        }
        Message message = new Message();
        message.setConversationId(conversationId);
        message.setSenderId(senderId);
        message.setContent("PRODUCT:" + productId);
        message.setSentAt(LocalDateTime.now());
        message.setRead(false);
        messageRepository.save(message);
    }

    public List<ConversationParticipants> getConversationMembers(Long conversationId) {
        return conversationParticipantsRepository.findByConversationId(conversationId);
    }

    @Transactional
    public JoinCommunityChatResponseDTO joinCommunityChat(Double latitude, Double longitude, Integer userId) {

        // 1. Xác định tên phường từ tọa độ
        String district = geo.getDistrictFromCoordinates(latitude, longitude);
        System.out.println("Quận: " + district);
        List<String> validDistricts = List.of(
                "Sơn Trà", "Ngũ Hành Sơn", "Thanh Khê",
                "Liên Chiểu", "Cẩm Lệ", "Hòa Vang", "Hải Châu"
        );

        if (!validDistricts.contains(district)) {
            return new JoinCommunityChatResponseDTO(false, "Không có nhóm chat cho khu vực này.", null, district);
        }

        // 2. Tìm nhóm chat có tên "Cộng đồng <district>"
        String groupName = "Cộng đồng " + district;
        Conversation conversation = conversationRepository.findByName(groupName);

        if (conversation == null) {
            return new JoinCommunityChatResponseDTO(false, "Nhóm chat cho khu vực này chưa tồn tại.", null, district);
        }

        // 3. Kiểm tra xem user đã trong nhóm chưa
        String checkSql = "SELECT COUNT(*) FROM ConversationParticipants WHERE ConversationID = ? AND UserID = ?";
        Long count = (Long) entityManager.createNativeQuery(checkSql)
                .setParameter(1, conversation.getConversationId())
                .setParameter(2, userId)
                .getSingleResult();

        if (count != null && count > 0) {
            return new JoinCommunityChatResponseDTO(true, "Bạn đã nằm trong nhóm chat '" + district + "'.", conversation.getConversationId(), district);
        }

        // 4. Thêm người dùng vào nhóm
        ConversationParticipants participant = new ConversationParticipants();
        participant.setUserId(userId);
        participant.setRole(ConversationParticipants.ParticipantRole.Member);
        participant.setConversation(conversation);
        participant.setJoinedAt(LocalDateTime.now());

        entityManager.persist(participant);

        return new JoinCommunityChatResponseDTO(true, "Bạn đã tham gia nhóm chat '" + district + "' thành công.", conversation.getConversationId(), district);
    }

    @Transactional
    public CreateCommunityChatResponseDTO createCommunityChat(Double latitude, Double longitude) {

        // 1. Xác định tên phường từ tọa độ (mock hoặc dùng Google Maps API)
        String district = getDistrictFromCoordinates(latitude, longitude);

        List<String> validDistricts = List.of(
                "Sơn Trà", "Ngũ Hành Sơn", "Thanh Khê",
                "Liên Chiểu", "Cẩm Lệ", "Hòa Vang", "Hải Châu"
        );

        if (!validDistricts.contains(district)) {
            return new CreateCommunityChatResponseDTO(false, "Phường không hợp lệ.", null, 0);
        }

        // 2. Tạo nhóm chat
        Conversation conversation = new Conversation();
        conversation.setName("Cộng đồng " + district);
        conversation.setGroup(true);
        conversation.setCreatedAt(LocalDateTime.now());
        conversation = conversationRepository.save(conversation);

        // 3. Tìm các Supplier gần vị trí này (bán kính 5km)
        String sqlFindSuppliers = "SELECT UserID FROM Users WHERE Role = 'SUPPLIER' AND " +
                "(6371 * acos(cos(radians(:lat)) * cos(radians(lat)) * " +
                "cos(radians(lng) - radians(:lng)) + sin(radians(:lat)) * " +
                "sin(radians(lat)))) <= 5";

        @SuppressWarnings("unchecked")
        List<Integer> supplierIDs = entityManager.createNativeQuery(sqlFindSuppliers)
                .setParameter("lat", latitude)
                .setParameter("lng", longitude)
                .getResultList();

        // 4. Thêm từng supplier vào nhóm chat
        int count = 0;
        for (Integer userId : supplierIDs) {
            ConversationParticipants participant = new ConversationParticipants();
            participant.setUserId(userId);
            participant.setRole(ConversationParticipants.ParticipantRole.Member);
            participant.setConversation(conversation); // tự động set conversationId
            participant.setJoinedAt(LocalDateTime.now());

            entityManager.persist(participant);
            count++;
        }

        return new CreateCommunityChatResponseDTO(true,
                "Nhóm cộng đồng '" + district + "' đã được tạo thành công.",
                conversation.getConversationId(), count);
    }


    private String getDistrictFromCoordinates(Double latitude, Double longitude) {
        if (latitude >= 16.04 && latitude <= 16.08 && longitude >= 108.20 && longitude <= 108.25) {
            return "Sơn Trà";
        } else if (latitude >= 15.99 && latitude <= 16.03 && longitude >= 108.22 && longitude <= 108.25) {
            return "Ngũ Hành Sơn";
        } else if (latitude >= 16.03 && latitude <= 16.06 && longitude >= 108.17 && longitude <= 108.19) {
            return "Thanh Khê";
        } else if (latitude >= 15.97 && latitude <= 16.00 && longitude >= 108.16 && longitude <= 108.18) {
            return "Liên Chiểu";
        } else if (latitude >= 15.99 && latitude <= 16.01 && longitude >= 108.18 && longitude <= 108.20) {
            return "Cẩm Lệ";
        } else if (latitude >= 15.91 && latitude <= 15.94 && longitude >= 108.18 && longitude <= 108.21) {
            return "Hòa Vang";
        } else if (latitude >= 16.05 && latitude <= 16.07 && longitude >= 108.16 && longitude <= 108.18) {
            return "Hải Châu";
        }
        return "Sơn Trà"; // Mặc định
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