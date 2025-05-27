package com.farm.farmtrade.service.google;

import com.farm.farmtrade.entity.User;
import com.farm.farmtrade.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("✅ [CustomOAuth2UserService] loadUser() called");

        OAuth2User user = super.loadUser(userRequest);
        System.out.println("✅ OAuth2User: " + user.getAttributes());

        String email = user.getAttribute("email");
        String name = user.getAttribute("name");

        if (userRepository.findByEmail(email).isEmpty()) {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(name);
            newUser.setIsActive(true);
            userRepository.save(newUser);
        }
        return user;
    }

}


