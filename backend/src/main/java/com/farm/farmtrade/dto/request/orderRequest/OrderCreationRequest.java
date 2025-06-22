package com.farm.farmtrade.dto.request.orderRequest;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderCreationRequest {

    @NotNull(message = "Buyer ID is required")
    Integer buyerId;
    @NotNull(message = "Supplier ID is required")
    Integer supplierId;
    @NotNull(message = "Order date is required")
    LocalDateTime orderDate;

    @NotBlank(message = "Order status cannot be blank")
    String status;
    @NotNull(message = "Order items are required")
    @Size(min = 1, message = "At least one item is required")
    List<OrderItemRequest> items;
    @NotBlank(message = "Address cannot be blank")
    String address;
}
