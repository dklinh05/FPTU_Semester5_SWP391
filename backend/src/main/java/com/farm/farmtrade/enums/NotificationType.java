package com.farm.farmtrade.enums;

import lombok.Getter;

@Getter
public enum NotificationType {
    // 🛒 Đơn hàng
    ORDER_CONFIRMED("Your order has been confirmed"),
    ORDER_SHIPPED("Your order is on the way"),
    ORDER_DELIVERED("Your order has been delivered"),
    ORDER_CANCELLED("Your order has been cancelled"),

    // 📦 Giao hàng
    DELIVERY_ASSIGNED("A shipper has been assigned to your order"),
    DELIVERY_STARTED("Your order is being delivered"),
    DELIVERY_COMPLETED("Delivery completed successfully"),

    // 💰 Thanh toán
    PAYMENT_SUCCESS("Payment was successful"),
    PAYMENT_FAILED("Payment failed"),
    REFUND_INITIATED("Refund initiated"),
    REFUND_COMPLETED("Refund completed"),

    // Voucher/Reward
    VOUCHER_EARNED("You have earned a new voucher"),
    VOUCHER_EXPIRED("Your voucher has expired"),
    POINTS_EARNED("You received reward points"),
    POINTS_REDEEMED("Reward points redeemed successfully"),

    // Hàng hóa
    PRODUCT_BACK_IN_STOCK("A product you're interested in is back in stock"),
    PRODUCT_LOW_STOCK("Product stock is running low"),

    // 📬 Tài khoản và hệ thống
    PROFILE_UPDATED("Your profile was updated"),
    ;


    private String message;
    NotificationType( String message) {
        this.message = message;
    }
}
