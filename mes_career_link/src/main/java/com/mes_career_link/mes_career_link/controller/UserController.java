package com.mes_career_link.mes_career_link.controller;

import com.mes_career_link.mes_career_link.dto.UserDTO;
import com.mes_career_link.mes_career_link.entity.User;
import com.mes_career_link.mes_career_link.exception.UserNotFoundException;
import com.mes_career_link.mes_career_link.service.EmailService;
import com.mes_career_link.mes_career_link.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final EmailService emailService;
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    public UserController(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    @GetMapping("/profile/username/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        Optional<UserDTO> userOptional = userService.getUserByUsername(username);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.status(404).body("User not found.");
        }
    }

    @GetMapping("/connections/{userId}")
    public ResponseEntity<?> getUserConnections(@PathVariable Long userId) {
        Optional<UserDTO> userOptional = userService.getUserById(userId);
        if (userOptional.isPresent()) {
            Set<UserDTO> connections = userOptional.get().getConnections();
            return ResponseEntity.ok(connections);
        } else {
            return ResponseEntity.status(404).body("User not found.");
        }
    }

    @PostMapping("/connect/{username}")
    public ResponseEntity<?> connectUser(@PathVariable String username, @RequestParam Long userId) {
        try {
            User user = userService.connectUser(username, userId);
            return ResponseEntity.ok(user);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        logger.info("Processing forgot password for email: {}", email);
        try {
            Optional<UserDTO> userOptional = userService.findByEmail(email);
            if (userOptional.isPresent()) {
                UserDTO user = userOptional.get();
                String resetToken = userService.createPasswordResetToken(user);
                logger.info("Reset token created: {}", resetToken);
                // Send resetToken to user's email
                String resetLink = "http://localhost:5173/reset-password/" + resetToken;
                emailService.sendSimpleMessage(user.getEmail(), "Password Reset Request", "To reset your password, click the link below:\n" + resetLink);
                logger.info("Password reset token sent to email: {}", email);
                return ResponseEntity.ok("Password reset token sent to email.");
            } else {
                logger.warn("User not found with email: {}", email);
                return ResponseEntity.status(404).body("User not found.");
            }
        } catch (Exception e) {
            logger.error("Error in forgot password process for email: {}", email, e);
            return ResponseEntity.status(500).body("Error in forgot password process.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        try {
            boolean isReset = userService.resetPassword(token, newPassword);
            if (isReset) {
                return ResponseEntity.ok("Password reset successfully.");
            } else {
                return ResponseEntity.status(400).body("Invalid token or token expired.");
            }
        } catch (Exception e) {
            logger.error("Error in reset password process", e);
            return ResponseEntity.status(500).body("Error in reset password process.");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String username) {
        try {
            List<UserDTO> users = userService.searchUsersByUsername(username);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching search results.");
        }
    }

    @PostMapping("/create")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        User user = userService.createUser(userDTO);
        return ResponseEntity.ok(userService.convertToDTO(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        Optional<UserDTO> userDTO = userService.getUserById(id);
        return userDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        User user = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(userService.convertToDTO(user));
    }

    @PutMapping("/profile/username/{username}")
    public ResponseEntity<UserDTO> updateUserProfile(
            @PathVariable String username,
            @RequestPart("userDetails") UserDTO userDTO,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            User user = userService.updateUserByUsername(username, userDTO, profileImage);
            UserDTO updatedUserDTO = userService.convertToDTO(user);
            return ResponseEntity.ok(updatedUserDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User and all associated details deleted successfully.");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting user.");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        try {
            userService.registerUser(userDTO);
            return ResponseEntity.ok("Registration successful! Please wait for admin approval.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error during registration.");
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingUsers() {
        List<UserDTO> pendingUsers = userService.getPendingUsers();
        return ResponseEntity.ok(pendingUsers);
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        try {
            userService.approveUser(id);
            return ResponseEntity.ok("User approved successfully.");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error approving user.");
        }
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<?> rejectUser(@PathVariable Long id) {
        try {
            userService.rejectUser(id);
            return ResponseEntity.ok("User rejected successfully.");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error rejecting user.");
        }
    }

}