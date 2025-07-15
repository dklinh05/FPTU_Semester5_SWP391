package com.farm.farmtrade.repository;

import com.farm.farmtrade.dto.response.chatResponse.SupplierDTO;
import com.farm.farmtrade.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {
    boolean existsByUsername(String username);
    User findByUserID(Integer userId);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByRole(String role);
    // Kiểm tra xem email đã tồn tại chưa
    Boolean existsByEmail(String email);
    // Dùng Native Query để tính khoảng cách địa lý
//    @Query(value = "SELECT u.UserID FROM Users u " +
//            "WHERE u.Role = 'SUPPLIER' AND " +
//            "6371 * 2 * ATAN2(SQRT(SIN(RADIANS(u.Lat - :lat) / 2) ^ 2 + COS(RADIANS(:lat)) * COS(RADIANS(u.Lat)) * SIN(RADIANS(u.Lng - :lng) / 2) ^ 2), SQRT(1 - (SIN(RADIANS(u.Lat - :lat) / 2) ^ 2 + COS(RADIANS(:lat)) * COS(RADIANS(u.Lat)) * SIN(RADIANS(u.Lng - :lng) / 2) ^ 2))) * 1000 <= :radius", nativeQuery = true)
//    List<Integer> findSuppliersByLocation(@Param("lat") double lat,
//                                          @Param("lng") double lng,
//                                          @Param("radius") int radiusInMeters);
//

    // 🔍 Native Query để tìm SUPPLIER trong bán kính 5km
    @Query(value = """
        SELECT u.UserID AS userId, u.FullName AS fullName
        FROM Users u
        WHERE u.Role = 'SUPPLIER'
          AND (
            6371 * 1000 * ACOS(
              COS(RADIANS(:userLat)) * COS(RADIANS(u.Lat)) *
              COS(RADIANS(u.Lng) - RADIANS(:userLng)) +
              SIN(RADIANS(:userLat)) * SIN(RADIANS(u.Lat))
            )
          ) <= :radius
        """, nativeQuery = true)
    List<SupplierDTO> findSuppliersByLocationWithinRadius(
            @Param("userLat") double userLat,
            @Param("userLng") double userLng,
            @Param("radius") int radiusInMeters
    );
}
