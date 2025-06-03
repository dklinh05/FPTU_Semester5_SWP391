package com.farm.farmtrade.service.fileStorage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FileStorageService {
    @Autowired
    ProductRepository productRepository;

    @Autowired
    private Cloudinary cloudinary;

    public Product uploadProductImage(String id, MultipartFile file) {
        Product product = productRepository.findById(Integer.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Product not found"));

        try {
            if (file.isEmpty()) {
                throw new RuntimeException("File trống hoặc không hợp lệ");
            }

            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "products",
                    "public_id", "product_" + id
            ));

            String imageUrl = (String) uploadResult.get("secure_url");
            product.setImageURL(imageUrl);
            return productRepository.save(product);

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi đọc file", e);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi upload avatar lên Cloudinary", e);
        }
    }
}
