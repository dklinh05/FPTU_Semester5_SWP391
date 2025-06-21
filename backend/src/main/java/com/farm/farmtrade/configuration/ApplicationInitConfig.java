package com.farm.farmtrade.configuration;


import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.enums.Role;
import com.farm.farmtrade.repository.UserRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.payos.PayOS;


@Configuration
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class    ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository){
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()){
                var role = Role.ADMIN.name();

                User user = User.builder()
                        .username("admin")
                        .passwordHash(passwordEncoder.encode("admin"))
                        .role(role)
                        .build();
                userRepository.save(user);
                log.warn("admin user has been created with default password: admin, please change it");
            }
        };
    }

    @Bean
    public PayOS payOS() {
        String clientId = "c5de2429-2233-4bce-a7ba-60ec82a01208";
        String apiKey = "c7acdb28-1ed8-45eb-91c5-bf6deb76f890";
        String checksumKey = "921d2d6e7ea6324c1b7fa479a8073c10d0aae704a3a7f6d3290048ad59ec345c";

        return new PayOS(clientId, apiKey, checksumKey);
    }
}
