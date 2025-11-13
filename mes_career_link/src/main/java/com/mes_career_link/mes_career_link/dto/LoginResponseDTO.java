package com.mes_career_link.mes_career_link.dto;

public class LoginResponseDTO {
    private String token;
    private String refreshToken;
    private Long userId;
    private String role; // Add the role field

    // Default constructor (required for serialization/deserialization)
    public LoginResponseDTO() {}

    // Constructor with all fields
    public LoginResponseDTO(String token, String refreshToken, Long userId, String role) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.role = role; // Initialize the role field
    }

    // Getter and Setter for token
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }

    // Getter and Setter for refreshToken
    public String getRefreshToken() {
        return refreshToken;
    }
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    // Getter and Setter for userId
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // Getter and Setter for role
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
}