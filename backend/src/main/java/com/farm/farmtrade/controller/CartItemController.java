package com.farm.farmtrade.controller;

import com.farm.farmtrade.dto.request.CartRequest.CartAddRequest;
import com.farm.farmtrade.dto.request.CartRequest.CartUpdateRequest;
import com.farm.farmtrade.entity.CartItem;
import com.farm.farmtrade.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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


    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(@RequestBody CartUpdateRequest request) {
        try {
            cartItemService.updateQuantity(request.getCartItemId(), request.getQuantity());
            return ResponseEntity.ok("Cart item updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Integer cartItemId) {
        try {
            cartItemService.removeFromCart(cartItemId);
            return ResponseEntity.ok("Cart Item deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }


    // Lấy danh sách giỏ hàng
    @GetMapping("/{buyerId}")
    public List<CartItem> getCartItems(@PathVariable Integer buyerId) {
        return cartItemService.getCartItems(buyerId);
    }

    @GetMapping("/count-items")
    public ResponseEntity<Integer> countCartItems(@RequestParam Integer buyerId) {
        Integer count = cartItemService.countProductsInCart(buyerId);
        return ResponseEntity.ok(count);
    }
}
