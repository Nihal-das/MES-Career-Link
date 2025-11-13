package com.mes_career_link.mes_career_link.dto;

import jakarta.validation.constraints.NotBlank;

public class MessageRequestDTO {

    @NotBlank
    private String senderUsername;

    @NotBlank
    private String receiverUsername;

    @NotBlank
    private String content;

    // Getters and setters
    public String getSenderUsername() {
        return senderUsername;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public String getReceiverUsername() {
        return receiverUsername;
    }

    public void setReceiverUsername(String receiverUsername) {
        this.receiverUsername = receiverUsername;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}