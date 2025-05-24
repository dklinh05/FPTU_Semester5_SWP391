package com.farm.farmtrade.repository;

import com.farm.farmtrade.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {}
