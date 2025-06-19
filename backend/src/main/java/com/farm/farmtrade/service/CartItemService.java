package com.farm.farmtrade.service;

import com.farm.farmtrade.entity.CartItem;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.CartItemRepository;
import com.farm.farmtrade.repository.ProductRepository;
import com.farm.farmtrade.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // Thêm hoặc cập nhật số lượng sản phẩm trong giỏ hàng
    @Transactional
    public CartItem addToCart(Integer buyerId, Integer productId, int quantity) {
        Optional<CartItem> existingItemOpt = cartItemRepository.findByBuyerUserIDAndProductProductID(buyerId, productId);

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + quantity); // cộng dồn số lượng
            return cartItemRepository.save(existingItem);
        }

        // Nếu chưa có thì thêm mới với số lượng yêu cầu
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người mua"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        CartItem newItem = new CartItem();
        newItem.setBuyer(buyer);
        newItem.setProduct(product);
        newItem.setQuantity(quantity);
        newItem.setCreatedAt(LocalDateTime.now());

        return cartItemRepository.save(newItem);
    }

    public void updateQuantity(Integer cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }
    }


    // Xóa sản phẩm khỏi giỏ hàng
    @Transactional
    public void removeFromCart(Integer cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    // Lấy danh sách giỏ hàng của người dùng
    public List<CartItem> getCartItems(Integer buyerId) {
        return cartItemRepository.findByBuyerUserID(buyerId);
    }

    public Integer countProductsInCart(Integer buyerId) {
        List<CartItem> items = cartItemRepository.findByBuyerUserID(buyerId);
        return items.size();
    }
}
