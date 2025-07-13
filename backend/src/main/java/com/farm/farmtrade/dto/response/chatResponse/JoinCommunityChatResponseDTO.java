package com.farm.farmtrade.dto.response.chatResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JoinCommunityChatResponseDTO {
    private boolean success;
    private String message;
    private Long conversationId;
    private String district;
}