package com.farm.farmtrade.dto.request.orderRequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderStatusUpdateRequest {
    @NotNull(message = "Order ID is required")
    Integer orderId;

    @NotBlank(message = "Status must not be blank")
    String newStatus;

    Integer supplierId;

    Integer shipperId;
}
