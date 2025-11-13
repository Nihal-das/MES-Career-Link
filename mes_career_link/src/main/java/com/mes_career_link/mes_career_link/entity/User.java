package com.mes_career_link.mes_career_link.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Set;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Auto-generated ID for User entity

    @Column(nullable = false, unique = true)
    private String username;  // Unique and non-null username

    @Column(nullable = false)
    private String name;  // Non-null name

    @Column(nullable = false, unique = true)
    private String email;  // Unique and non-null email

    @Column(nullable = false)
    private String password;  // Non-null password

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;  // Non-null role

    private String designation;
    private String company;
    private String countryOfWork;
    private String gender;

    @Column(nullable = true)
    private String profileImageUrl;  // URL to the profile image

    @Column(nullable = false)
    private boolean approved = false; // New field for admin approval

    // One-to-many relationship with Post
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // Ignore this field during serialization
    private Set<Post> posts;

    // One-to-many relationship with Comment
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // Ignore this field during serialization
    private Set<Comment> comments;

    // Many-to-many relationship with Post for likes
    @ManyToMany(mappedBy = "likedByUsers", fetch = FetchType.LAZY)
    @JsonIgnore  // Ignore this field during serialization
    private Set<Post> likedPosts;

    // Many-to-many relationship for connections
    @ManyToMany
    @JoinTable(
            name = "user_connections",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "connected_user_id")
    )
    @JsonIgnore
    private Set<User> connections;

    // Enum for roles
    public enum Role {
        ADMIN, STUDENT, ALUMNI, TEACHER
    }

    // Default constructor (required for JPA)
    public User() {}

    // Constructor for creating User with all required fields
    public User(String username, String name, String email, String password, Role role) {
        this.username = username;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getCountryOfWork() {
        return countryOfWork;
    }

    public void setCountryOfWork(String countryOfWork) {
        this.countryOfWork = countryOfWork;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public Set<Post> getPosts() {
        return posts;
    }

    public void setPosts(Set<Post> posts) {
        this.posts = posts;
    }

    public Set<Comment> getComments() {
        return comments;
    }

    public void setComments(Set<Comment> comments) {
        this.comments = comments;
    }

    public Set<Post> getLikedPosts() {
        return likedPosts;
    }

    public void setLikedPosts(Set<Post> likedPosts) {
        this.likedPosts = likedPosts;
    }

    public Set<User> getConnections() {
        return connections;
    }

    public void setConnections(Set<User> connections) {
        this.connections = connections;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }
}