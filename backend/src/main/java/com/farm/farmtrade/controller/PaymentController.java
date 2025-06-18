package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.request.payment.PaymentCreationRequest;
import com.farm.farmtrade.service.payment.PaypalService;
import com.farm.farmtrade.service.payment.PaymentService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaypalService paypalService;
    private final PaymentService paymentService;

    // FE REACT URLS
    private static final String SUCCESS_REACT_URL = "http://localhost:5173/payment/success";
    private static final String FAILURE_REACT_URL = "http://localhost:5173/payment/failure";
    private static final String CANCEL_REACT_URL = "http://localhost:5173/payment/cancel";

    // BE SPRING URLs (PayPal redirect về đây)
    private static final String SUCCESS_API_URL = "http://localhost:8080/farmtrade/payment/success";
    private static final String CANCEL_API_URL = "http://localhost:8080/farmtrade/payment/cancel";

    // Quy đổi VND->USD: 1 USD = 24,000 VND
    private static final BigDecimal EXCHANGE_RATE = new BigDecimal("25000");

    @PostMapping
    public ResponseEntity<Map<String, String>> createPayment(@RequestBody PaymentCreationRequest request) {
        try {
            String successUrlWithOrderGroup = SUCCESS_API_URL + "?orderGroupId=" + request.getOrderGroupId();

            BigDecimal amountVND = new BigDecimal(request.getAmount());
            BigDecimal amountUSD = amountVND.divide(EXCHANGE_RATE, 2, RoundingMode.HALF_UP);

            Payment payment = paypalService.createPaymentWithPayPal(
                    amountUSD.doubleValue(),
                    "USD",
                    "paypal",
                    "sale",
                    "Thanh toán đơn hàng",
                    CANCEL_API_URL,
                    successUrlWithOrderGroup,
                    request.getOrderGroupId()
            );

            for (Links link : payment.getLinks()) {
                if (link.getRel().equals("approval_url")) {
                    Map<String, String> response = new HashMap<>();
                    response.put("redirectUrl", link.getHref()); // ✅ Trả về URL dạng JSON
                    return ResponseEntity.ok(response);
                }
            }
        } catch (PayPalRESTException e) {
            log.error("Error creating PayPal payment", e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Could not create PayPal payment"));
    }

    @GetMapping("/success")
    public RedirectView paymentSuccess(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId,
            @RequestParam("orderGroupId") Integer orderGroupId
    ) {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if ("approved".equalsIgnoreCase(payment.getState())) {
                paymentService.savePayPalPayment(orderGroupId);
                return new RedirectView(SUCCESS_REACT_URL);
            }
        } catch (Exception e) {
            log.error("Error executing PayPal payment", e);
        }
        return new RedirectView(FAILURE_REACT_URL);
    }

    @GetMapping("/cancel")
    public RedirectView paymentCancel() {
        return new RedirectView(CANCEL_REACT_URL);
    }
}

