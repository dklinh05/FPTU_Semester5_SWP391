package com.farm.farmtrade.dto.request.chatRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JoinCommunityChatRequestDTO {
    private Double latitude;
    private Double longitude;
    private Integer userId;
}