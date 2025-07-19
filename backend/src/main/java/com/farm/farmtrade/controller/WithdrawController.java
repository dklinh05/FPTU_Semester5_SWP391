package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.request.withdraw.WithdrawRequestDTO;
import com.farm.farmtrade.service.withdraw.WithdrawRequestService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/withdraw")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WithdrawController {
    @Autowired
    WithdrawRequestService withdrawRequestService;

    @PostMapping
    public ResponseEntity<String> createWithdrawRequest(@RequestBody WithdrawRequestDTO requestDTO) {
        withdrawRequestService.requestWithdraw(requestDTO.getSupplierId(), requestDTO.getAmountRequested(), requestDTO.getBankName(), requestDTO.getBankAccountNumber());
        return ResponseEntity.ok("Yêu cầu rút tiền đã được gửi.");
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveWithdraw(
            @PathVariable("id") Integer requestId,
            @RequestBody String note) {
        withdrawRequestService.processWithdrawRequest(requestId,"APPROVED",note);
        return ResponseEntity.ok("Yêu cầu rút tiền đã được duyệt.");
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<String> rejectWithdraw(
            @PathVariable("id") Integer requestId,
            @RequestBody String note) {
        withdrawRequestService.processWithdrawRequest(requestId,"REJECTED",note);
        return ResponseEntity.ok("Yêu cầu rút tiền đã bị từ chối.");
    }

}
