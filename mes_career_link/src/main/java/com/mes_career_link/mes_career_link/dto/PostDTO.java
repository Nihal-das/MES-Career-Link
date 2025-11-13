package com.mes_career_link.mes_career_link.dto;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

public class PostDTO {

    private Long id;
    private String imageUrl;
    private Date timestamp;
    private int likes;
    private String content;
    private String username;
    private String profileImageUrl; // Add this field
    private List<String> likedByUsernames = new ArrayList<>();
    private List<CommentDTO> comments = new ArrayList<>();

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public List<String> getLikedByUsernames() {
        return likedByUsernames;
    }

    public void setLikedByUsernames(List<String> likedByUsernames) {
        this.likedByUsernames = likedByUsernames;
    }

    public List<CommentDTO> getComments() {
        return comments;
    }

    public void setComments(List<CommentDTO> comments) {
        this.comments = comments;
    }
}