package com.farm.farmtrade.service.fileStorage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.ProductRepository;
import com.farm.farmtrade.repository.RoleUpgradeRepository;
import com.farm.farmtrade.repository.UserRepository;
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
    Cloudinary cloudinary;
    private final RoleUpgradeRepository roleUpgradeRepository;

    @Autowired
    UserRepository userRepository;

    public Product uploadProductImage(String id, MultipartFile file) {
        Product product = productRepository.findById(Integer.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Product not found"));

        try {
            if (file.isEmpty()) {
                throw new RuntimeException("File trống hoặc không hợp lệ");
            }

            // Xóa ảnh cũ nếu đã tồn tại URL
            if (product.getImageURL() != null && !product.getImageURL().isEmpty()) {
                // public_id là "products/product_{id}" (nếu đã upload với folder + public_id trước đó)
                String publicId = "products/product_" + id;

                try {
                    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                } catch (Exception e) {
                    System.err.println("Không thể xoá ảnh cũ trên Cloudinary: " + e.getMessage());
                    // Không throw để tiếp tục upload ảnh mới
                }
            }

            // Upload ảnh mới
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "products",
                    "public_id", "product_" + id,
                    "overwrite", true // Ghi đè nếu trùng public_id
            ));

            String imageUrl = (String) uploadResult.get("secure_url");
            product.setImageURL(imageUrl);
            return productRepository.save(product);

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi đọc file", e);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi upload ảnh lên Cloudinary", e);
        }
    }


    public String uploadCertificationImage(String id, MultipartFile certification) {
        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    certification.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "certifications",
                            "public_id", "cert_" + id,
                            "overwrite", true
                    )
            );
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi đọc file", e);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi upload file", e);
        }
    }
}



//    public User uploadCertificationImage(String id, MultipartFile file) {
//        User user = userRepository.findById(Integer.valueOf(id))
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        try {
//            if (file.isEmpty()) {
//                throw new RuntimeException("File trống hoặc không hợp lệ");
//            }
//
//            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
//                    "folder", "users",
//                    "public_id", "cert_" + id,
//                    "overwrite", true
//            ));
//
//            String imageUrl = (String) uploadResult.get("secure_url");
//            user.setCertification(imageUrl);
//            return userRepository.save(user);
//
//        } catch (IOException e) {
//            throw new RuntimeException("Lỗi khi đọc file", e);
//        } catch (Exception e) {
//            throw new RuntimeException("Lỗi khi upload file lên Cloudinary", e);
//        }
//    }
