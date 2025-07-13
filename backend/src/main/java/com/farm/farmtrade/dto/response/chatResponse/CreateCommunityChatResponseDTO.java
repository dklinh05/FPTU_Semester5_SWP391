package com.farm.farmtrade.dto.response.chatResponse;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCommunityChatResponseDTO {
    private boolean success;
    private String message;
    private Long conversationId;
    private int suppliersAdded;
}