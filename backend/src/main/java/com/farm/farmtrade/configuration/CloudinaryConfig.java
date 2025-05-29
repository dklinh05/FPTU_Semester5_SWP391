package com.farm.farmtrade.configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dmc0xhltu",
                "api_key", "922955258268685",
                "api_secret", "S3EExa5lYup-xYlvd29T6qenWBQ",
                "secure", true
        ));
    }
}