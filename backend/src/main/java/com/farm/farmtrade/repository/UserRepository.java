package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);
    //    boolean existsByEmail(String email);
//    User findByEmail(String email);
    Optional<User> findByEmail(String email);
    // Tìm user theo email

    // Kiểm tra xem email đã tồn tại chưa
    Boolean existsByEmail(String email);
    List<User> findByRole(String role);

}
