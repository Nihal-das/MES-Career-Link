package com.mes_career_link.mes_career_link.controller;

import com.mes_career_link.mes_career_link.dto.LoginRequestDTO;
import com.mes_career_link.mes_career_link.dto.LoginResponseDTO;
import com.mes_career_link.mes_career_link.dto.UserDTO;
import com.mes_career_link.mes_career_link.entity.User;
import com.mes_career_link.mes_career_link.service.UserService;
import com.mes_career_link.mes_career_link.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        Optional<UserDTO> optionalUserDTO = userService.getUserByUsername(loginRequest.getUsername());
        if (optionalUserDTO.isPresent()) {
            UserDTO userDTO = optionalUserDTO.get();
            User user = convertToEntity(userDTO);
            String token = jwtUtil.generateToken(user, 3600); // 1-hour expiry
            String refreshToken = jwtUtil.generateRefreshToken(user, 604800); // 7-day expiry

            setCookie(response, "token", token, 3600);
            setCookie(response, "refreshToken", refreshToken, 604800);

            return ResponseEntity.ok(new LoginResponseDTO(token, refreshToken, user.getId(), user.getRole().name())); // Add role to response
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        clearCookie(response, "token");
        clearCookie(response, "refreshToken");
        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@CookieValue("refreshToken") String refreshToken, HttpServletResponse response) {
        if (jwtUtil.validateToken(refreshToken)) {
            String username = jwtUtil.extractUsername(refreshToken);
            Optional<UserDTO> optionalUserDTO = userService.getUserByUsername(username);
            if (optionalUserDTO.isPresent()) {
                UserDTO userDTO = optionalUserDTO.get();
                User user = convertToEntity(userDTO);
                String newToken = jwtUtil.generateToken(user, 3600); // 1-hour expiry

                setCookie(response, "token", newToken, 3600);

                return ResponseEntity.ok(new LoginResponseDTO(newToken, refreshToken, user.getId(), user.getRole().name()));
            }
        }
        return ResponseEntity.status(401).body("Invalid refresh token");
    }

    private void setCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Change to `true` in production
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        response.addCookie(cookie);
    }

    private void clearCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private User convertToEntity(UserDTO userDTO) {
        User user = new User();
        user.setId(userDTO.getId());
        user.setUsername(userDTO.getUsername());
        user.setProfileImageUrl(userDTO.getProfileImageUrl());
        if (userDTO.getRole() != null) {
            user.setRole(User.Role.valueOf(userDTO.getRole()));
        } else {
            throw new IllegalArgumentException("User role cannot be null");
        }
        return user;
    }
}