package com.mes_career_link.mes_career_link.config;

import com.mes_career_link.mes_career_link.security.JwtAuthenticationFilter;
import com.mes_career_link.mes_career_link.service.CustomUserDetailsService;
import com.mes_career_link.mes_career_link.util.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtUtil jwtUtil) {
        return new JwtAuthenticationFilter(jwtUtil, customUserDetailsService);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http.csrf().disable()
                .authorizeRequests(authorize -> authorize
                        .requestMatchers("/auth/**", "/users/forgot-password", "/users/reset-password", "/users/signup").permitAll()  // Allow access to authentication and password reset endpoints
                        .requestMatchers("/posts/**").permitAll()  // Allow access to posts endpoint without authentication
                        .requestMatchers("/uploads/**").permitAll()  // Allow access to image uploads without authentication
                        .requestMatchers("/chat/**").permitAll()  // Allow access to WebSocket endpoint without authentication
                        .requestMatchers("/messages/**").authenticated()  // Require authentication for messages endpoints
                        .requestMatchers("/users/**").authenticated()  // Require authentication for users endpoints
                        .requestMatchers("/error").permitAll()  // Allow access to the error endpoint
                        .anyRequest().authenticated()  // Require authentication for all other requests
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .cors(); // Enable CORS

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(List.of("http://localhost:5173")); // Allow specific origin
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}