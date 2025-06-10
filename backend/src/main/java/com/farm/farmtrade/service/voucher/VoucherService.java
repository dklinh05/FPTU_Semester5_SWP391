package com.farm.farmtrade.service.voucher;

import com.farm.farmtrade.dto.request.voucherRequest.VoucherCreationRequest;
import com.farm.farmtrade.dto.request.voucherRequest.VoucherUpdateRequest;
import com.farm.farmtrade.entity.Voucher;
import com.farm.farmtrade.repository.VoucherRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    @Transactional
    public Voucher createVoucher(VoucherCreationRequest request) {
        // Kiểm tra trùng mã code
        if (voucherRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Voucher code already exists: " + request.getCode());
        }

        // Tạo voucher mới
        Voucher voucher = new Voucher();
        voucher.setCode(request.getCode());
        voucher.setDescription(request.getDescription());
        voucher.setDiscountType(request.getDiscountType());
        voucher.setDiscountValue(request.getDiscountValue());
        voucher.setMinOrderAmount(
                request.getMinOrderAmount() != null ? request.getMinOrderAmount() : BigDecimal.ZERO
        );
        voucher.setRequiredPoints(request.getRequiredPoints());
        voucher.setMaxUsage(
                request.getMaxUsage() != null ? request.getMaxUsage() : 1
        );
        voucher.setExpirationDate(request.getExpirationDate());
        voucher.setCreatedAt(java.time.LocalDateTime.now());

        // Lưu vào database
        return voucherRepository.save(voucher);
    }

    public Voucher updateVoucher(Integer voucherId, VoucherUpdateRequest request) {
        Optional<Voucher> optionalVoucher = voucherRepository.findById(voucherId);

        if (!optionalVoucher.isPresent()) {
            throw new IllegalArgumentException("Voucher with ID " + voucherId + " not found");
        }

        Voucher voucher = optionalVoucher.get();

        if (request.getDescription() != null) voucher.setDescription(request.getDescription());
        if (request.getDiscountType() != null) voucher.setDiscountType(request.getDiscountType());
        if (request.getDiscountValue() != null) voucher.setDiscountValue(request.getDiscountValue());
        if (request.getMinOrderAmount() != null) voucher.setMinOrderAmount(request.getMinOrderAmount());
        if (request.getRequiredPoints() != null) voucher.setRequiredPoints(request.getRequiredPoints());
        if (request.getMaxUsage() != null) voucher.setMaxUsage(request.getMaxUsage());
        if (request.getExpirationDate() != null) voucher.setExpirationDate(request.getExpirationDate());

        return voucherRepository.save(voucher);
    }


    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    public Voucher getVoucherById(Integer id) {
        return voucherRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Voucher with ID " + id + " not found"));
    }
}
