package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.request.orderRequest.OrderGroupRequest;
import com.farm.farmtrade.dto.request.orderRequest.OrderStatusUpdateRequest;
import com.farm.farmtrade.dto.request.orderRequest.UpdateOrderStatusRequest;
import com.farm.farmtrade.dto.response.orderResponse.OrderGroupResponse;
import com.farm.farmtrade.dto.response.orderResponse.OrderItemResponse;
import com.farm.farmtrade.dto.response.orderResponse.OrderResponse;
import com.farm.farmtrade.entity.Order;
import com.farm.farmtrade.repository.OrderRepository;
import com.farm.farmtrade.service.order.OrderGroupService;
import com.farm.farmtrade.service.order.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    @Autowired
    private final OrderService orderService;
    @Autowired
    private final OrderGroupService orderGroupService;

    @Autowired
    private final OrderRepository orderRepository;
    // Tạo đơn hàng mới
//    @PostMapping
//    public ResponseEntity<Order> createOrder(@RequestBody OrderCreationRequest request) {
//        Order createdOrder = orderService.createOrder(request);
//        return ResponseEntity.ok(createdOrder);
//    }

    //  Lấy toàn bộ đơn hàng
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // Lấy đơn hàng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Integer id) {
        OrderResponse order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    // Xóa đơn hàng theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Integer id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Order with ID " + id + " has been deleted successfully.");
    }
    //cập nhật order status
    @PostMapping("/update-order-status")
    public ResponseEntity<String> updateOrderStatus(@RequestBody UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + request.getOrderId()));

        order.setStatus(request.getStatus());
        orderRepository.save(order);

        return ResponseEntity.ok("Order status updated successfully.");
    }

    //lấy đơn hàng theo ID người mua
    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByBuyer(@PathVariable Integer buyerId) {
        List<OrderResponse> orders = orderService.getOrdersByBuyerId(buyerId);
        return ResponseEntity.ok(orders);
    }


    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<OrderItemResponse>> getOrderItemsByOrderId(@PathVariable Integer orderId) {
        List<OrderItemResponse> orderItems = orderService.getOrderItemsByOrderId(orderId);
        return ResponseEntity.ok(orderItems);
    }

    //order group
    @PostMapping("/ordersGroup")
    public ResponseEntity<OrderGroupResponse> createOrderGroup(@RequestBody OrderGroupRequest request) {
        OrderGroupResponse created = orderGroupService.createOrderGroup(request);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/ordersGroup")
    public ResponseEntity<List<OrderGroupResponse>> getAllOrderGroups() {
        return ResponseEntity.ok(orderGroupService.getAllOrderGroups());
    }

    @GetMapping("/ordersGroup/{id}")
    public ResponseEntity<OrderGroupResponse> getOrderGroupById(@PathVariable String id) {
        return ResponseEntity.ok(orderGroupService.getOrderGroupById(id));
    }

    @GetMapping("/ordersGroup/buyer/{buyerId}")
    public ResponseEntity<List<OrderGroupResponse>> getOrderGroupsByBuyerId(@PathVariable Integer buyerId) {
        List<OrderGroupResponse> responses = orderGroupService.getOrderGroupsByBuyerId(buyerId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/group/{orderGroupId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByOrderGroupId(@PathVariable Integer orderGroupId) {
        List<OrderResponse> orders = orderService.getOrdersByOrderGroupId(orderGroupId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/supplier/{supplierId}/orders")
    public ResponseEntity<Page<OrderResponse>> getOrdersBySupplier(
            @PathVariable Integer supplierId,
            @RequestParam(required = false) String status,  // ví dụ filter theo trạng thái đơn hàng
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderDate,desc") String sortBy
    ) {
        Page<OrderResponse> orders = orderService.getOrdersBySupplierId(supplierId, status, page, size, sortBy);
        return ResponseEntity.ok(orders);
    }


    @PutMapping("/update-status")
    public ResponseEntity<?> updateOrderStatus(@Valid @RequestBody OrderStatusUpdateRequest request) {
        try {
            orderService.updateOrderStatus(request);
            return ResponseEntity.ok("Order status updated successfully.");
        } catch (IllegalArgumentException | SecurityException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
