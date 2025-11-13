package com.mes_career_link.mes_career_link.dto;

public class LoginRequestDTO {
    private String username;
    private String password;

    // Default constructor (required for serialization/deserialization)
    public LoginRequestDTO() {}

    // Constructor
    public LoginRequestDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}