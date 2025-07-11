package com.farm.farmtrade.service.order;

import com.farm.farmtrade.dto.request.orderRequest.OrderCreationRequest;
import com.farm.farmtrade.dto.request.orderRequest.OrderItemRequest;
import com.farm.farmtrade.dto.request.orderRequest.OrderStatusUpdateRequest;
import com.farm.farmtrade.dto.response.orderResponse.OrderItemResponse;
import com.farm.farmtrade.dto.response.orderResponse.OrderResponse;
import com.farm.farmtrade.entity.*;
import com.farm.farmtrade.repository.*;
import com.farm.farmtrade.service.ProductService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService {
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserVoucherRepository userVoucherRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    OrderItemRepository orderItemRepository;
    @Autowired
    ProductService productService;
    @Autowired
    VoucherRepository voucherRepository;

    //tạo đơn hàng mới
    @Transactional
    public Order createOrder(OrderCreationRequest request) {
        User buyer = userRepository.findById(request.getBuyerId())
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found with ID: " + request.getBuyerId()));

//        UserVoucher userVoucher = null;
//        Voucher voucher = null;
//        if (request.getUserVoucherId() != null) {
//            userVoucher = userVoucherRepository.findById(request.getUserVoucherId())
//                    .orElseThrow(() -> new IllegalArgumentException("UserVoucher not found with ID: " + request.getUserVoucherId()));
//            if (userVoucher.getIsUsed()) {
//                throw new IllegalArgumentException("Voucher has already been used");
//            }
//            if (!userVoucher.getUser().getUserID().equals(request.getBuyerId())) {
//                throw new IllegalArgumentException("This voucher does not belong to the buyer");
//            }
//            voucher = userVoucher.getVoucher();
//            if (voucher.getExpirationDate() != null && voucher.getExpirationDate().isBefore(LocalDateTime.now())) {
//                throw new IllegalArgumentException("Voucher has expired");
//            }
//            if (voucher.getMaxUsage() != null && voucher.getMaxUsage() == 0) {
//                throw new IllegalArgumentException("This voucher has reached its maximum number of uses");
//            }
//        }

        Order order = Order.builder()
                .buyer(buyer)
                .orderDate(LocalDateTime.now())
                .status(request.getStatus())
                .totalAmount(BigDecimal.ZERO)
                .build();

        order = orderRepository.save(order); // tạo order trước để có ID

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + itemReq.getProductId()));

            int orderedQuantity = itemReq.getQuantity();

            // Kiểm tra tồn kho
            if (product.getStockQuantity() == null || product.getStockQuantity() < orderedQuantity) {
                throw new IllegalArgumentException("Not enough stock for product: " + product.getName());
            }

            BigDecimal unitPrice = product.getPrice();

            // Tạo OrderItem
            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(orderedQuantity)
                    .price(unitPrice)
                    .build();
            orderItemRepository.save(item);

            // Trừ tồn kho
            product.setStockQuantity(product.getStockQuantity() - orderedQuantity);
            productRepository.save(product);

            // Cộng tổng tiền
            totalAmount = totalAmount.add(unitPrice.multiply(BigDecimal.valueOf(orderedQuantity)));
        }

//        // Áp dụng giảm giá nếu có
//        BigDecimal discountAmount = BigDecimal.ZERO;
//        if (voucher != null) {
//            // Check min order
//            if (voucher.getMinOrderAmount() != null && totalAmount.compareTo(voucher.getMinOrderAmount()) < 0) {
//                throw new IllegalArgumentException("Order amount does not meet the minimum for this voucher");
//            }
//
//            if ("PERCENT".equalsIgnoreCase(voucher.getDiscountType())) {
//                discountAmount = totalAmount.multiply(voucher.getDiscountValue())
//                        .divide(BigDecimal.valueOf(100));
//            } else if ("AMOUNT".equalsIgnoreCase(voucher.getDiscountType())) {
//                discountAmount = voucher.getDiscountValue();
//            }
//
//            // Không để giảm vượt tổng tiền
//            if (discountAmount.compareTo(totalAmount) > 0) {
//                discountAmount = totalAmount;
//            }
//
//            // Đánh dấu đã dùng
//            userVoucher.setIsUsed(true);
//            userVoucherRepository.save(userVoucher);
//            // Giảm MaxUsage trong bảng Voucher (nếu đang > 0)
//            if (voucher.getMaxUsage() != null && voucher.getMaxUsage() > 0) {
//                voucher.setMaxUsage(voucher.getMaxUsage() - 1);
//                voucherRepository.save(voucher);
//            }
//        }

        // Lưu lại các giá trị
//        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(totalAmount);
        return orderRepository.save(order);
    }


    //Lấy danh sách tất cả đơn hàng.
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    //Lấy đơn hàng theo ID.
    public OrderResponse getOrderById(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + id));

        return OrderResponse.builder()
                .orderID(order.getOrderID())
                .buyerId(order.getBuyer() != null ? order.getBuyer().getUserID() : null)
                .supplierId(order.getSupplier() != null ? order.getSupplier().getUserID() : null)
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .orderGroupId(order.getOrderGroup() != null ? order.getOrderGroup().getOrderGroupID() : null)
                .customerName(order.getBuyer() != null ? order.getBuyer().getFullName() : null)
                .build();
    }


    // Xóa đơn hàng theo ID.
    public void deleteOrder(Integer id) {
        if (!orderRepository.existsById(id)) {
            throw new IllegalArgumentException("Order not found with ID: " + id);
        }
        orderRepository.deleteById(id);
    }

    // tìm order theo buyerID
    public List<OrderResponse> getOrdersByBuyerId(Integer buyerId, String status) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found with ID: " + buyerId));

        List<Order> orders = orderRepository.findByBuyer(buyer);

        // Lọc theo status nếu có truyền
        if (status != null && !status.isBlank()) {
            String statusFilter = status.trim().toLowerCase();
            orders = orders.stream()
                    .filter(order -> order.getStatus() != null &&
                            order.getStatus().trim().toLowerCase().equals(statusFilter))
                    .collect(Collectors.toList());
        }


        return orders.stream()
                .map(order -> new OrderResponse(
                        order.getOrderID(),
                        order.getShipper() != null ? order.getShipper().getUserID() : null,
                        order.getBuyer() != null ? order.getBuyer().getUserID() : null,
                        order.getSupplier() != null ? order.getSupplier().getUserID() : null,
                        order.getSupplier() != null ? order.getSupplier().getFullName() : null,
                        order.getOrderDate(),
                        order.getStatus(),
                        order.getTotalAmount(),
                        order.getOrderGroup().getOrderGroupID(),
                        order.getBuyer().getFullName()
                ))
                .collect(Collectors.toList());
    }


//    // tìm order theo shipperID
//    public List<Order> getOrdersByShipperId(Integer shipperId) {
//        User shipper = userRepository.findById(shipperId)
//                .orElseThrow(() -> new IllegalArgumentException("Shipper not found with ID: " + shipperId));
//
//        return orderRepository.findByShipper(shipper);
//    }

    public List<OrderItemResponse> getOrderItemsByOrderId(Integer orderId) {
        List<OrderItem> items = orderItemRepository.findByOrderOrderID(orderId);

        return items.stream().map(item -> {
            Product product = item.getProduct();
            return new OrderItemResponse(
                    item.getOrderItemID(),
                    item.getQuantity(),
                    item.getPrice(),
                    product.getProductID(),
                    product.getName(),
                    product.getImageURL()
            );
        }).collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByOrderGroupId(Integer orderGroupId) {
        List<Order> orders = orderRepository.findByOrderGroupOrderGroupID(orderGroupId);

        return orders.stream()
                .map(order -> OrderResponse.builder()
                        .orderID(order.getOrderID())
                        .buyerId(order.getBuyer() != null ? order.getBuyer().getUserID() : null)
                        .supplierId(order.getSupplier() != null ? order.getSupplier().getUserID() : null)
                        .orderDate(order.getOrderDate())
                        .status(order.getStatus())
                        .totalAmount(order.getTotalAmount())
                        .orderGroupId(order.getOrderGroup() != null ? order.getOrderGroup().getOrderGroupID() : null)
                        .customerName(order.getBuyer() != null ? order.getBuyer().getFullName() : null)
                        .build()
                ).collect(Collectors.toList());
    }

    public Page<OrderResponse> getOrdersBySupplierId(Integer supplierId, String status, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("orderDate")));
        if (sortBy != null && !sortBy.isEmpty()) {
            String[] sortParts = sortBy.split(",");
            Sort.Direction direction = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            pageable = PageRequest.of(page, size, Sort.by(new Sort.Order(direction, sortParts[0])));
        }

        Page<Order> ordersPage;
        if (status != null && !status.isEmpty()) {
            ordersPage = orderRepository.findBySupplierUserIDAndStatus(supplierId, status, pageable);
        } else {
            ordersPage = orderRepository.findBySupplierUserID(supplierId, pageable);
        }

        Page<OrderResponse> orderResponses = ordersPage.map(order -> OrderResponse.builder()
                .orderID(order.getOrderID())
                .buyerId(order.getBuyer() != null ? order.getBuyer().getUserID() : null)
                .supplierId(order.getSupplier() != null ? order.getSupplier().getUserID() : null)
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .orderGroupId(order.getOrderGroup() != null ? order.getOrderGroup().getOrderGroupID() : null)
                .customerName(order.getBuyer() != null ? order.getBuyer().getFullName() : null)
                .build());

        return orderResponses;
    }

    @Transactional
    public void updateOrderStatus(OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + request.getOrderId()));

        if (!order.getSupplier().getUserID().equals(request.getSupplierId())) {
            throw new SecurityException("You are not authorized to update this order.");
        }

        order.setStatus(request.getNewStatus());
        orderRepository.save(order);
    }

    @Transactional
    public OrderResponse  assignNearestShipper(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        User supplier = order.getSupplier();
        if (supplier.getLat() == null || supplier.getLng() == null) {
            throw new IllegalArgumentException("Supplier does not have location info");
        }

        List<User> shippers = userRepository.findByRole("SHIPPER");
        if (shippers.isEmpty()) {
            throw new IllegalStateException("No shippers available");
        }

        // Tìm shipper gần nhất
        User nearestShipper = null;
        double minDistance = Double.MAX_VALUE;

        for (User shipper : shippers) {
            if (shipper.getLat() == null || shipper.getLng() == null) continue;

            double distance = productService.haversineDistance(
                    supplier.getLat(), supplier.getLng(),
                    shipper.getLat(), shipper.getLng()
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearestShipper = shipper;
            }
        }

        if (nearestShipper == null) {
            throw new IllegalStateException("No valid shipper with location found");
        }

        order.setShipper(nearestShipper);
        orderRepository.save(order);

        return OrderResponse.builder()
                .orderID(order.getOrderID())
                .shipperId(order.getShipper() != null ? order.getShipper().getUserID() : null)
                .buyerId(order.getBuyer() != null ? order.getBuyer().getUserID() : null)
                .supplierId(order.getSupplier() != null ? order.getSupplier().getUserID() : null)
                .supplierName(order.getSupplier() != null ? order.getSupplier().getFullName() : null)
                .orderDate(order.getOrderDate())
                .status("DELIVERING")
                .totalAmount(order.getTotalAmount())
                .orderGroupId(order.getOrderGroup() != null ? order.getOrderGroup().getOrderGroupID() : null)
                .customerName(order.getBuyer() != null ? order.getBuyer().getFullName() : null)
                .build();
    }


}
