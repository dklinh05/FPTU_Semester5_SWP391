package com.farm.farmtrade.configuration;

import com.farm.farmtrade.service.google.CustomOAuth2UserService;
import com.farm.farmtrade.service.google.OAuth2SuccessHandler;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.spec.SecretKeySpec;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {


    @Value("${jwt.signerKey}")
    private String signerKey;

    private final String[] ADMIN_ENDPOINTS = {"/admin/**", "/users", "/admin", "/voucher/**", "/voucher"};
    private final String[] PUBLIC_POST_ENDPOINTS = {"/api/auth/**", "/oauth2/**", "/users/register", "/auth/**", "/orders", "/orders/**", "/voucher", "/voucher/**"};
    private final String[] PUBLIC_GET_ENDPOINTS = {"/auth/**", "/products/**"};

    @Autowired
    private OAuth2SuccessHandler oAuth2SuccessHandler;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

  
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/products/{id}/status").permitAll() // tạm thời để all role
                        .requestMatchers(HttpMethod.POST, PUBLIC_POST_ENDPOINTS).permitAll() // cho phép truy cập public chỉ với HttpMethod POST
                        .requestMatchers(HttpMethod.GET, PUBLIC_GET_ENDPOINTS).permitAll()
                        .requestMatchers(ADMIN_ENDPOINTS).hasAuthority("ROLE_ADMIN")// chỉ admin mới truy cập được endpoint này(mặc định là ADMIN truy cập được full đường truyền được config cho SUPPLIER và CUSTOMER, tương tự SUPPLIER cũng được truy cập endpoint của CUSTOMER), nhưng phải cung cấp token)
                        .requestMatchers("/users/**").hasAuthority("ROLE_CUSTOMER")
                        // Mặc định yêu cầu đăng nhập
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(user -> user.userService(customOAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                )
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwtConfigurer ->
                                jwtConfigurer.decoder(jwtDecoder())
                                        .jwtAuthenticationConverter((jwtAuthenticationConverter())))
                );

        return http.build();
    }

    // Cấu hình CORS cho phép frontend truy cập
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of("http://localhost:5173"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setExposedHeaders(List.of("Set-Cookie"));
                config.setAllowCredentials(true);
                return config;
            }
        };
    }

    // JwtAuthenticationConverter để ánh xạ role từ token
    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return converter;
    }

    // JwtDecoder cho resource server
    @Bean
    JwtDecoder jwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");
        return NimbusJwtDecoder.withSecretKey(secretKeySpec).macAlgorithm(MacAlgorithm.HS512).build();
    }

    // Password encoder mặc định
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}