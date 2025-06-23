package com.farm.farmtrade.controller;

import com.farm.farmtrade.configuration.VNPAY.VNPAYService;
import com.farm.farmtrade.dto.request.payment.VNPayRequest;
import com.farm.farmtrade.service.payment.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/vnpay")
@RequiredArgsConstructor
@Slf4j
public class VNPayController {
    @Autowired
    private VNPAYService vnPayService;
    @Autowired
    private PaymentService paymentService;

    private static final String SUCCESS_REACT_URL = "http://localhost:5173/orders";
    private static final String FAILURE_REACT_URL = "http://localhost:5173/orders/pending";


    @PostMapping("")
    public ObjectNode submitVNPayOrder(@RequestBody VNPayRequest vnPayRequest,
                                       HttpServletRequest request) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();

        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();

        try {
            String vnpayUrl = vnPayService.createOrder(
                    vnPayRequest.getAmount(),
                    vnPayRequest.getOrderGroupId(),
                    baseUrl
            );

            ObjectNode dataNode = objectMapper.createObjectNode();
            dataNode.put("checkoutUrl", vnpayUrl);

            response.put("error", 0);
            response.put("message", "success");
            response.set("data", dataNode);
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            return response;
        }
    }



    @GetMapping("/vnpay-payment")
    public RedirectView GetMapping(HttpServletRequest request, Model model) {

        String orderGroupId = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");

        model.addAttribute("orderId", orderGroupId);
        model.addAttribute("totalPrice", totalPrice);
        model.addAttribute("paymentTime", paymentTime);
        model.addAttribute("transactionId", transactionId);

        try {
            int paymentStatus = vnPayService.orderReturn(request);
            if (paymentStatus == 1) {
                paymentService.saveVNPpayPayment(Integer.valueOf(orderGroupId));
                return new RedirectView(SUCCESS_REACT_URL);
            }
        } catch (Exception e) {
            log.error("Error executing VNPAY payment", e);
        }
        return new RedirectView(FAILURE_REACT_URL);

    }
}