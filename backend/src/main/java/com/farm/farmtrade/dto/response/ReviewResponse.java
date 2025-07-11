package com.farm.farmtrade.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReviewResponse {
    private Integer reviewID;
    private String comment;
    private Integer productQuality;
    private Integer sellerService;
    private Integer deliverySpeed;
    private String buyerUsername;
    private LocalDateTime reviewDate;
    private List<String> imageList;
}