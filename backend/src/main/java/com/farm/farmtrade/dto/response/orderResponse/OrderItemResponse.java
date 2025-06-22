    package com.farm.farmtrade.dto.response.orderResponse;

    import com.farm.farmtrade.entity.Order;
    import com.farm.farmtrade.entity.Product;
    import jakarta.persistence.*;
    import lombok.*;
    import lombok.experimental.FieldDefaults;

    import java.math.BigDecimal;


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public class OrderItemResponse {
        private Integer orderItemID;
        private Integer quantity;
        private BigDecimal price;
        private Integer productId;
        private String productName;
        private String productImage;
    }
