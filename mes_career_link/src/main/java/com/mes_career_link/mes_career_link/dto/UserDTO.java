package com.mes_career_link.mes_career_link.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Set;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserDTO {

    private Long id;
    private String username;
    private String name;
    private String email;
    private String password;
    private String role;
    private String designation;
    private String company;
    private String countryOfWork;
    private String gender;
    private String profileImageUrl;
    private Set<UserDTO> connections;

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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getCountryOfWork() {
        return countryOfWork;
    }

    public void setCountryOfWork(String countryOfWork) {
        this.countryOfWork = countryOfWork;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public Set<UserDTO> getConnections() {
        return connections;
    }

    public void setConnections(Set<UserDTO> connections) {
        this.connections = connections;
    }
}