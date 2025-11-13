package com.mes_career_link.mes_career_link.service;

import com.mes_career_link.mes_career_link.dto.UserDTO;
import com.mes_career_link.mes_career_link.entity.PasswordResetToken;
import com.mes_career_link.mes_career_link.entity.User;
import com.mes_career_link.mes_career_link.exception.UserNotFoundException;
import com.mes_career_link.mes_career_link.repository.PasswordResetTokenRepository;
import com.mes_career_link.mes_career_link.repository.UserRepository;
import com.mes_career_link.mes_career_link.repository.PostRepository;
import com.mes_career_link.mes_career_link.repository.CommentRepository;
import com.mes_career_link.mes_career_link.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository tokenRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final MessageRepository messageRepository;

    private final Path uploadDirectory = Paths.get("src/main/resources/static/uploads");

    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, PasswordResetTokenRepository tokenRepository, PostRepository postRepository, CommentRepository commentRepository, MessageRepository messageRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepository = tokenRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.messageRepository = messageRepository;
    }

    @Transactional(readOnly = true)
    public Optional<UserDTO> findByEmail(String email) {
        return userRepository.findByEmail(email).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Optional<UserDTO> getUserById(Long userId) {
        return userRepository.findById(userId).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Optional<UserDTO> getUserByUsername(String username) {
        return userRepository.findByUsername(username).map(this::convertToDTO);
    }

    @Transactional
    public User createUser(UserDTO userDTO) {
        User user = convertToEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long userId, UserDTO userDTO) {
        return userRepository.findById(userId).map(user -> {
            user.setName(userDTO.getName());
            user.setUsername(userDTO.getUsername());
            user.setEmail(userDTO.getEmail());
            user.setRole(User.Role.valueOf(userDTO.getRole()));
            if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            }
            user.setDesignation(userDTO.getDesignation());
            user.setCompany(userDTO.getCompany());
            user.setCountryOfWork(userDTO.getCountryOfWork());
            user.setGender(userDTO.getGender());
            user.setProfileImageUrl(userDTO.getProfileImageUrl());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User updateUserByUsername(String username, UserDTO userDTO, MultipartFile profileImage) throws IOException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        user.setDesignation(userDTO.getDesignation());
        user.setCompany(userDTO.getCompany());
        user.setCountryOfWork(userDTO.getCountryOfWork());
        user.setGender(userDTO.getGender());

        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                // Ensure the upload directory exists
                if (!Files.exists(uploadDirectory)) {
                    Files.createDirectories(uploadDirectory);
                }

                // Create a unique filename
                String fileExtension = Optional.ofNullable(profileImage.getOriginalFilename())
                        .filter(f -> f.contains("."))
                        .map(f -> f.substring(profileImage.getOriginalFilename().lastIndexOf('.')))
                        .orElse("");
                String safeFileName = username + "_" + UUID.randomUUID() + fileExtension;
                Path targetPath = uploadDirectory.resolve(safeFileName);

                // Write the file
                Files.write(targetPath, profileImage.getBytes());

                // Set relative path for frontend access
                user.setProfileImageUrl("/uploads/" + safeFileName);

            } catch (IOException e) {
                logger.error("Error saving profile image for user " + username, e);
                throw new RuntimeException("Could not store file. Try again later.");
            }
        }

        return userRepository.save(user);
    }



    @Transactional
    public String createPasswordResetToken(UserDTO userDTO) {
        User user = convertToEntity(userDTO);
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(1);
        PasswordResetToken resetToken = new PasswordResetToken(token, user.getEmail(), expiryDate);
        tokenRepository.save(resetToken);
        return token;
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> resetTokenOptional = tokenRepository.findByToken(token);
        if (resetTokenOptional.isPresent()) {
            PasswordResetToken resetToken = resetTokenOptional.get();
            if (resetToken.getExpiryDate().isAfter(LocalDateTime.now())) {
                Optional<User> userOptional = userRepository.findByEmail(resetToken.getEmail());
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    user.setPassword(passwordEncoder.encode(newPassword));
                    userRepository.save(user);
                    tokenRepository.delete(resetToken);
                    return true;
                }
            }
        }
        return false;
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserDTO> searchUsersByUsername(String username) {
        List<User> users = userRepository.findByUsernameContaining(username);
        return users.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public User connectUser(String username, Long userId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));

        user.getConnections().add(targetUser);
        targetUser.getConnections().add(user);

        userRepository.save(user);
        userRepository.save(targetUser);

        return user;
    }

    @Transactional(readOnly = true)
    public Set<UserDTO> getUserConnections(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        return user.getConnections().stream()
                .map(this::convertToDTOWithoutConnections)
                .collect(Collectors.toSet());
    }

    public UserDTO convertToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole() != null ? user.getRole().name() : null);
        userDTO.setDesignation(user.getDesignation());
        userDTO.setCompany(user.getCompany());
        userDTO.setCountryOfWork(user.getCountryOfWork());
        userDTO.setGender(user.getGender());
        userDTO.setProfileImageUrl(user.getProfileImageUrl());
        userDTO.setConnections(user.getConnections().stream()
                .map(this::convertToDTOWithoutConnections)
                .collect(Collectors.toSet()));
        return userDTO;
    }

    private UserDTO convertToDTOWithoutConnections(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole() != null ? user.getRole().name() : null);
        userDTO.setDesignation(user.getDesignation());
        userDTO.setCompany(user.getCompany());
        userDTO.setCountryOfWork(user.getCountryOfWork());
        userDTO.setGender(user.getGender());
        userDTO.setProfileImageUrl(user.getProfileImageUrl());
        return userDTO;
    }

    private User convertToEntity(UserDTO userDTO) {
        User user = new User();
        user.setId(userDTO.getId());
        user.setUsername(userDTO.getUsername());
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setRole(User.Role.valueOf(userDTO.getRole()));
        user.setPassword(userDTO.getPassword());
        user.setDesignation(userDTO.getDesignation());
        user.setCompany(userDTO.getCompany());
        user.setCountryOfWork(userDTO.getCountryOfWork());
        user.setGender(userDTO.getGender());
        user.setProfileImageUrl(userDTO.getProfileImageUrl());
        return user;
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));

        // Delete associated messages where the user is either the sender or receiver
        messageRepository.deleteByReceiverId(userId);
        messageRepository.deleteAllBySenderOrReceiver(userId);

        // Delete associated posts and comments
        postRepository.deleteAllByUser(user);
        commentRepository.deleteAllByUser(user);

        // Remove user from the connections of other users
        for (User connection : user.getConnections()) {
            connection.getConnections().remove(user);
        }

        // Finally, delete the user
        userRepository.delete(user);
    }

    @Transactional
    public void registerUser(UserDTO userDTO) {
        User user = convertToEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setApproved(false); // Set approved to false initially
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getPendingUsers() {
        List<User> users = userRepository.findByApproved(false);
        return users.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public void approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        user.setApproved(true);
        userRepository.save(user);
    }

    @Transactional
    public void rejectUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        userRepository.delete(user);
    }
}