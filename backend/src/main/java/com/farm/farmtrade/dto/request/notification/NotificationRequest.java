package com.farm.farmtrade.dto.request.notification;

import lombok.Data;

@Data
public class NotificationRequest {
    private Integer userId;
    private Integer contentId;
    private String title;
    private String message;
    private String type;
}
