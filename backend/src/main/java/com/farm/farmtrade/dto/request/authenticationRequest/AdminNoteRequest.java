package com.farm.farmtrade.dto.request.authenticationRequest;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminNoteRequest {
    Integer requestId;
    String adminNote;
}
