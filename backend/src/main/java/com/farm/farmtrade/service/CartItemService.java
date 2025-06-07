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
    public CartItem addToCart(Integer buyerId, Integer productId) {
        Optional<CartItem> existingItemOpt = cartItemRepository.findByBuyerUserIDAndProductProductID(buyerId, productId);
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            return cartItemRepository.save(existingItem);
        }

        // Nếu chưa tồn tại thì tạo mới
        User buyer = userRepository.findById(String.valueOf(buyerId))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người mua"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        CartItem newItem = new CartItem();
        newItem.setBuyer(buyer);
        newItem.setProduct(product);
        newItem.setQuantity(1);
        newItem.setCreatedAt(LocalDateTime.now());

        return cartItemRepository.save(newItem);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    @Transactional
    public void removeFromCart(Integer buyerId, Integer productId) {
        cartItemRepository.deleteByBuyerUserIDAndProductProductID(buyerId, productId);
    }

    // Lấy danh sách giỏ hàng của người dùng
    public List<CartItem> getCartItems(Integer buyerId) {
        return cartItemRepository.findByBuyerUserID(buyerId);
    }

}
