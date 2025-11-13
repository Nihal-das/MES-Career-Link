package com.mes_career_link.mes_career_link.dto;

public class ConversationDTO {
    private String username;
    private String lastMessage;

    // Default constructor
    public ConversationDTO() {}

    // Constructor to initialize fields
    public ConversationDTO(String username, String lastMessage) {
        this.username = username;
        this.lastMessage = lastMessage;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }
}