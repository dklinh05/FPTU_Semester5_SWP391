package com.farm.farmtrade.dto.request.chatRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCommunityChatRequestDTO {
    private Double latitude;
    private Double longitude;

    // Getters and setters
}