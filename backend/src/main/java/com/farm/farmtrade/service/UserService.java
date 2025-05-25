package com.farm.farmtrade.service;

import com.farm.farmtrade.dto.Request.UserCreationRequest;
import com.farm.farmtrade.dto.Request.UserUpdateRequest;
import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    @Autowired
    private UserRepository userRepository;


    public User createRequest(UserCreationRequest request) {
        User user = new User();
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("User already exists");
        }
        user.setUsername(request.getUsername());
        user.setPasswordHash(request.getPasswordHash());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUser(String id) {
        return userRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("User Not Found"));
    }

    public User updateUser(String userId, UserUpdateRequest request) {
        User user = getUser(userId);

        user.setPasswordHash(request.getPasswordHash());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());

        return userRepository.save(user);
    }
}
