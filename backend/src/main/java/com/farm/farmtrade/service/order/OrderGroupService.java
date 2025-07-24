package com.farm.farmtrade.service.order;

import com.farm.farmtrade.dto.request.orderRequest.OrderCreationRequest;
import com.farm.farmtrade.dto.request.orderRequest.OrderGroupRequest;
import com.farm.farmtrade.dto.request.orderRequest.OrderItemRequest;
import com.farm.farmtrade.dto.response.ShippingFeeResponse;
import com.farm.farmtrade.dto.response.orderResponse.OrderGroupResponse;
import com.farm.farmtrade.dto.response.orderResponse.OrderResponse;
import com.farm.farmtrade.entity.*;
import com.farm.farmtrade.repository.*;
import com.farm.farmtrade.service.notification.NotificationService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderGroupService {
    UserRepository userRepository;
    ProductRepository productRepository;
    OrderGroupRepository orderGroupRepository;
    OrderRepository orderRepository;
    OrderItemRepository orderItemRepository;
    UserVoucherRepository userVoucherRepository;
    VoucherRepository voucherRepository;
    CartItemRepository cartItemRepository;
    @Autowired
    NotificationService notificationService;

    @Transactional
    public OrderGroupResponse createOrderGroup(OrderGroupRequest request) {
        User buyer = userRepository.findById(request.getBuyerId())
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found with ID: " + request.getBuyerId()));

        UserVoucher userVoucher = null;
        Voucher voucher = null;
        if (request.getUserVoucherId() != null) {
            userVoucher = userVoucherRepository.findById(request.getUserVoucherId())
                    .orElseThrow(() -> new IllegalArgumentException("UserVoucher not found with ID: " + request.getUserVoucherId()));
            if (!userVoucher.getUser().getUserID().equals(request.getBuyerId())) {
                throw new IllegalArgumentException("This voucher does not belong to the buyer");
            }
            voucher = userVoucher.getVoucher();
            if (voucher.getExpirationDate() != null && voucher.getExpirationDate().isBefore(LocalDateTime.now())) {
                throw new IllegalArgumentException("Voucher has expired");
            }
            if (voucher.getMaxUsage() != null && voucher.getMaxUsage() == 0) {
                throw new IllegalArgumentException("This voucher has reached its maximum number of uses");
            }
        }

        OrderGroup orderGroup = OrderGroup.builder()
                .buyer(buyer)
                .userVoucher(userVoucher)
                .totalAmount(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .finalAmount(BigDecimal.ZERO)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .orders(new ArrayList<>())
                .build();
        orderGroup = orderGroupRepository.save(orderGroup);

        BigDecimal groupTotal = BigDecimal.ZERO;

        for (OrderCreationRequest orderReq : request.getOrders()) {
            User supplier = userRepository.findById(orderReq.getSupplierId())
                    .orElseThrow(() -> new IllegalArgumentException("Supplier not found with ID: " + orderReq.getSupplierId()));
            Order order = Order.builder()
                    .buyer(buyer)
                    .supplier(supplier)
                    .status(orderReq.getStatus())
                    .orderDate(LocalDateTime.now())
                    .totalAmount(BigDecimal.ZERO)
                    .orderGroup(orderGroup)
                    .address(orderReq.getAddress())
                    .lat(orderReq.getLat())
                    .lng(orderReq.getLng())
                    .build();
            order = orderRepository.save(order);

            BigDecimal orderTotal = BigDecimal.ZERO;
            for (OrderItemRequest itemReq : orderReq.getItems()) {
                Product product = productRepository.findById(itemReq.getProductId())
                        .orElseThrow(() -> new IllegalArgumentException("Product not found"));
                BigDecimal price = product.getPrice();

                OrderItem item = OrderItem.builder()
                        .order(order)
                        .product(product)
                        .quantity(itemReq.getQuantity())
                        .price(price)
                        .build();
                orderItemRepository.save(item);

                if (product.getStockQuantity() < itemReq.getQuantity()) {
                    throw new IllegalArgumentException("Not enough stock for product ID: " + product.getProductID());
                }

                product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
                product.setSales(product.getSales() + itemReq.getQuantity());
                productRepository.save(product);

                orderTotal = orderTotal.add(price.multiply(BigDecimal.valueOf(itemReq.getQuantity())));
            }

            // ✅ Tính khoảng cách và phí ship
            double distance = calculateDistance(
                    orderReq.getLat(), orderReq.getLng(),
                    supplier.getLat(), supplier.getLng()
            );
            BigDecimal shippingFee = calculateShippingFee(distance);


            order.setTotalAmount(orderTotal.add(shippingFee)); // cộng tổng + ship

            orderRepository.save(order);
            groupTotal = groupTotal.add(orderTotal.add(shippingFee));

            // ✅ Gửi thông báo cho supplier
            String title = "Bạn có đơn hàng mới";
            String message = String.format("Bạn vừa nhận được đơn hàng #%d từ %s.",
                    order.getOrderID(), buyer.getFullName());
            notificationService.createNotification(supplier.getUserID(), title, message, "ORDER_NEW", order.getOrderID());

            // ✅ Xóa cart item tương ứng
            List<OrderItem> orderItems = orderItemRepository.findByOrderOrderID(order.getOrderID());
            for (OrderItem item : orderItems) {
                cartItemRepository.deleteByBuyerUserIDAndProductProductID(
                        order.getBuyer().getUserID(),
                        item.getProduct().getProductID()
                );
            }
        }

        BigDecimal discount = BigDecimal.ZERO;
        if (voucher != null && userVoucher != null) {
            discount = applyVoucherDiscount(voucher, userVoucher, groupTotal);
        }

        orderGroup.setTotalAmount(groupTotal);
        orderGroup.setDiscountAmount(discount);
        orderGroup.setFinalAmount(groupTotal.subtract(discount));
        orderGroupRepository.save(orderGroup);

        return toOrderGroupResponse(orderGroup);
    }


    public List<OrderGroupResponse> getAllOrderGroups() {
        List<OrderGroup> orderGroups = orderGroupRepository.findAll();
        return orderGroups.stream()
                .map(this::toOrderGroupResponse)
                .collect(Collectors.toList());
    }

    public OrderGroupResponse getOrderGroupById(String id) {
        OrderGroup orderGroup = orderGroupRepository.findById(Integer.valueOf(id))
                .orElseThrow(() -> new IllegalArgumentException("OrderGroup not found with ID: " + id));
        return toOrderGroupResponse(orderGroup);
    }


    public OrderGroupResponse toOrderGroupResponse(OrderGroup orderGroup) {
        return OrderGroupResponse.builder()
                .orderGroupID(orderGroup.getOrderGroupID())
                .buyerId(orderGroup.getBuyer().getUserID())
                .totalAmount(orderGroup.getTotalAmount())
                .discountAmount(orderGroup.getDiscountAmount())
                .finalAmount(orderGroup.getFinalAmount())
                .status(orderGroup.getStatus())
                .createdAt(orderGroup.getCreatedAt())
                .userVoucherId(orderGroup.getUserVoucher() != null ? orderGroup.getUserVoucher().getUserVoucherID() : null)
                .orders(orderGroup.getOrders().stream()
                        .map(this::toOrderResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    public OrderResponse toOrderResponse(Order order) {
        return OrderResponse.builder()
                .orderID(order.getOrderID())
                .buyerId(order.getBuyer() != null ? order.getBuyer().getUserID() : null)
                .supplierId(order.getSupplier() != null ? order.getSupplier().getUserID() : null)
                .status(order.getStatus())
                .orderDate(order.getOrderDate())
                .totalAmount(order.getTotalAmount())
                .orderGroupId(order.getOrderGroup() != null ? order.getOrderGroup().getOrderGroupID() : null)
                .build();
    }

    private BigDecimal applyVoucherDiscount(Voucher voucher, UserVoucher userVoucher, BigDecimal groupTotal) {
        if (voucher == null) return BigDecimal.ZERO;

        // Kiểm tra tổng tiền đơn hàng có đủ điều kiện giảm
        if (voucher.getMinOrderAmount() != null && groupTotal.compareTo(voucher.getMinOrderAmount()) < 0) {
            throw new IllegalArgumentException("Order amount doesn't meet voucher minimum requirement");
        }

        BigDecimal discount;
        if ("PERCENT".equalsIgnoreCase(voucher.getDiscountType())) {
            discount = groupTotal.multiply(voucher.getDiscountValue()).divide(BigDecimal.valueOf(100));
        } else if ("AMOUNT".equalsIgnoreCase(voucher.getDiscountType())) {
            discount = voucher.getDiscountValue();
        } else {
            throw new IllegalArgumentException("Unknown discount type: " + voucher.getDiscountType());
        }

        // Không cho giảm vượt quá tổng tiền
        if (discount.compareTo(groupTotal) > 0) {
            discount = groupTotal;
        }

        // Xoá bản ghi UserVoucher thay vì đánh dấu isUsed = true
        userVoucher.setIsUsed(true);
        userVoucherRepository.save(userVoucher);

        // Giảm MaxUsage nếu > 0
        if (voucher.getMaxUsage() != null && voucher.getMaxUsage() > 0) {
            voucher.setMaxUsage(voucher.getMaxUsage() - 1);
            voucherRepository.save(voucher);
        }

        return discount;
    }

    public List<OrderGroupResponse> getOrderGroupsByBuyerId(Integer buyerId) {
        List<OrderGroup> orderGroups = orderGroupRepository.findByBuyerUserID(buyerId);
        return orderGroups.stream()
                .filter(group -> "PENDING".equalsIgnoreCase(group.getStatus()))
                .sorted(Comparator.comparing(OrderGroup::getOrderGroupID).reversed()) // 👈 Giảm dần theo ID
                .map(this::toOrderGroupResponse)
                .collect(Collectors.toList());
    }

    // hủy đơn hàng
    @Transactional
    public void cancelOrderGroup(Integer orderGroupId) {
        OrderGroup orderGroup = orderGroupRepository.findById(orderGroupId)
                .orElseThrow(() -> new IllegalArgumentException("OrderGroup not found with ID: " + orderGroupId));

        if ("CANCELLED".equalsIgnoreCase(orderGroup.getStatus())) {
            throw new IllegalStateException("OrderGroup is already canceled");
        }
        orderGroup.setStatus("CANCELLED");
        for (Order order : orderGroup.getOrders()) {
            order.setStatus("CANCELLED");
            orderRepository.save(order);
        }
        orderGroupRepository.save(orderGroup);
    }


    public ShippingFeeResponse calculateFee(Double lat, Double lng, Long supplierId) {
        User supplier = userRepository.findById(Math.toIntExact(supplierId))
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found with ID: " + supplierId));

        if (supplier.getLat() == null || supplier.getLng() == null) {
            throw new IllegalArgumentException("Supplier location not available.");
        }

        double distance = calculateDistance(lat, lng, supplier.getLat(), supplier.getLng());
        BigDecimal fee = calculateShippingFee(distance);

        return new ShippingFeeResponse(distance, fee);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371; // km

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS * c;
    }

    private BigDecimal calculateShippingFee(double distance) {
        if (distance < 3) {
            return BigDecimal.ZERO;
        } else if (distance < 5) {
            return BigDecimal.valueOf(10000);
        } else if (distance < 10) {
            return BigDecimal.valueOf(20000);
        } else {
            return BigDecimal.valueOf(30000);
        }
    }

}
