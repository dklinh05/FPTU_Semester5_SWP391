package com.farm.farmtrade.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.farm.farmtrade.dto.request.payment.CreatePaymentLinkRequestBody;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.PaymentData;
import vn.payos.type.PaymentLinkData;
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;

import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/payos")
public class PayOSController {
    private static final String SUCCESS_REACT_URL = "http://localhost:5173/orders";
    private static final String CANCEL_REACT_URL = "http://localhost:5173/orders/pending";
    private final PayOS payOS;

    public PayOSController(PayOS payOS) {
        this.payOS = payOS;
    }

    //  1. Tạo đơn thanh toán
    @PostMapping("/create")
    public ObjectNode createPayment(@Valid @RequestBody CreatePaymentLinkRequestBody request) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();

        try {
            // Tạo mã đơn hàng từ timestamp
            long orderCode = Long.parseLong(String.valueOf(new Date().getTime()).substring(7));

            PaymentData paymentData = PaymentData.builder()
                    .orderCode(orderCode)
                    .description(request.getOrderGroupId())
                    .amount(request.getPrice())
                    .returnUrl(SUCCESS_REACT_URL)
                    .cancelUrl(CANCEL_REACT_URL)
                    .build();

            CheckoutResponseData data = payOS.createPaymentLink(paymentData);

            response.put("error", 0);
            response.put("message", "success");
            response.set("data", objectMapper.valueToTree(data));
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            return response;
        }
    }

    // 2. Lấy thông tin đơn theo orderId
    @GetMapping("/{orderId}")
    public ObjectNode getOrder(@PathVariable("orderId") long orderId) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();

        try {
            PaymentLinkData order = payOS.getPaymentLinkInformation(orderId);
            response.set("data", objectMapper.valueToTree(order));
            response.put("error", 0);
            response.put("message", "ok");
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            return response;
        }
    }

    //  3. Hủy đơn
    @PutMapping("/{orderId}/cancel")
    public ObjectNode cancelOrder(@PathVariable("orderId") long orderId,
                                  @RequestBody(required = false) Map<String, String> body) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        try {
            String reason = body != null ? body.getOrDefault("reason", null) : null;
            PaymentLinkData order = payOS.cancelPaymentLink(orderId, reason);

            response.set("data", objectMapper.valueToTree(order));
            response.put("error", 0);
            response.put("message", "cancelled");
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            return response;
        }
    }

    //  4. Xác nhận webhook (PayOS yêu cầu gọi confirm)
    @PostMapping("/webhook/confirm")
    public ObjectNode confirmWebhook(@RequestBody Map<String, String> requestBody) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();

        try {
            String result = payOS.confirmWebhook(requestBody.get("webhookUrl"));
            response.set("data", objectMapper.valueToTree(result));
            response.put("error", 0);
            response.put("message", "confirmed");
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            return response;
        }
    }

    //  5. Nhận dữ liệu webhook (PayOS gửi thông báo thanh toán thành công)
    @PostMapping("/webhook/receive")
    public ObjectNode receiveWebhook(@RequestBody ObjectNode body)
            throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();

        try {
            Webhook webhookBody = objectMapper.treeToValue(body, Webhook.class);
            WebhookData data = payOS.verifyPaymentWebhookData(webhookBody);
            System.out.println("📦 Nhận webhook thành công: " + data);

            response.put("error", 0);
            response.put("message", "Webhook received");
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            return response;
        }
    }
}

