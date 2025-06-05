package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.Request.CartRequest.CartAddRequest;
import com.farm.farmtrade.dto.Request.CartRequest.CartDeleteRequest;
import com.farm.farmtrade.entity.CartItem;
import com.farm.farmtrade.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "*") // Điều chỉnh nếu cần thiết
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

    // Thêm sản phẩm vào giỏ hàng
    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@RequestBody CartAddRequest request) {
        cartItemService.addToCart(request.getBuyerId(), request.getProductId(), request.getQuantity());
        return ResponseEntity.ok("Thêm vào giỏ hàng thành công");
    }


    // Xóa sản phẩm khỏi giỏ hàng
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromCart(@RequestBody CartDeleteRequest request) {
        try{
            cartItemService.removeFromCart(request.getBuyerId(), request.getProductId());
            return ResponseEntity.ok().body("Cart Item deleted successfully");
        }catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Lấy danh sách giỏ hàng
    @GetMapping("/{buyerId}")
    public List<CartItem> getCartItems(@PathVariable Integer buyerId) {
        return cartItemService.getCartItems(buyerId);
    }
}
