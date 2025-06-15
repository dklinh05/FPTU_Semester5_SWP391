package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.request.orderRequest.OrderGroupRequest;
import com.farm.farmtrade.dto.response.orderResponse.OrderGroupResponse;
import com.farm.farmtrade.dto.response.orderResponse.OrderItemResponse;
import com.farm.farmtrade.dto.response.orderResponse.OrderResponse;
import com.farm.farmtrade.entity.Order;
import com.farm.farmtrade.service.order.OrderGroupService;
import com.farm.farmtrade.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<Order> getOrderById(@PathVariable Integer id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    // Xóa đơn hàng theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Integer id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Order with ID " + id + " has been deleted successfully.");
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

}
