package com.farm.farmtrade.dto.request.orderRequest;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class OrderGroupRequest {
    @NotNull(message = "Buyer ID is required")
    Integer buyerId;

    LocalDateTime orderDate; // Optional, default server time

    Integer userVoucherId; // Nullable nếu không dùng voucher

    @NotNull(message = "Orders must not be null")
    List<OrderCreationRequest> orders; // Mỗi đơn hàng tương ứng với 1 supplier
}
