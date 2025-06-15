package com.farm.farmtrade.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name = "OrderItems")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer orderItemID;
    @ManyToOne
    @JoinColumn(name = "OrderID")
    Order order;

    @ManyToOne
    @JoinColumn(name = "ProductID")
    Product product;
    Integer quantity;
    BigDecimal price;

}

