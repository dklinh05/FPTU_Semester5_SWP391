package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.request.voucherRequest.RedeemVoucherRequest;
import com.farm.farmtrade.dto.request.voucherRequest.VoucherCreationRequest;
import com.farm.farmtrade.dto.request.voucherRequest.VoucherUpdateRequest;
import com.farm.farmtrade.entity.UserVoucher;
import com.farm.farmtrade.entity.Voucher;
import com.farm.farmtrade.repository.VoucherRepository;
import com.farm.farmtrade.service.voucher.UserVoucherService;
import com.farm.farmtrade.service.voucher.VoucherService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/voucher")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VoucherController {
    @Autowired
    VoucherService voucherService;
    @Autowired
    VoucherRepository voucherRepository;
    @Autowired
    UserVoucherService userVoucherService;
    //tạo voucher
    @PostMapping
    public ResponseEntity<Voucher> createVoucher(@Valid @RequestBody VoucherCreationRequest request) {
        Voucher createdVoucher = voucherService.createVoucher(request);
        return ResponseEntity.ok(createdVoucher);
    }
    //update voucher
    @PutMapping("{id}")
    public ResponseEntity<Voucher> updateVoucher(
            @PathVariable("id") Integer voucherId,
            @RequestBody VoucherUpdateRequest request) {
        Voucher updatedVoucher = voucherService.updateVoucher(voucherId, request);
        return ResponseEntity.ok(updatedVoucher);
    }
    //lấy ra toàn bộ voucher
    @GetMapping
    public ResponseEntity<List<Voucher>> getAllVouchers() {
        List<Voucher> vouchers = voucherService.getAllVouchers();
        return ResponseEntity.ok(vouchers);
    }

    //lấy voucher theo id
    @GetMapping("/{id}")
    public ResponseEntity<Voucher> getVoucherById(@PathVariable("id") String id) {
        Voucher voucher = voucherService.getVoucherById(Integer.valueOf(id));
        return ResponseEntity.ok(voucher);
    }

    /**
     * Người dùng đổi voucher (đổi bằng điểm thưởng)
     */
    @PostMapping("/users/redeem")
    public ResponseEntity<UserVoucher> redeemVoucher(@RequestBody RedeemVoucherRequest request) {
        UserVoucher userVoucher = userVoucherService.redeemVoucher(request.getUserId(), request.getVoucherId());
        return ResponseEntity.ok(userVoucher);
    }

    /**
     * Lấy tất cả voucher đã dùng/chưa dùng của người dùng(đã đổi)
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<List<UserVoucher>> getAllByUser(@PathVariable String userId) {
        List<UserVoucher> vouchers = userVoucherService.getUserVouchersByUserAndUsage(Integer.valueOf(userId),false);
        return ResponseEntity.ok(vouchers);
    }

}
