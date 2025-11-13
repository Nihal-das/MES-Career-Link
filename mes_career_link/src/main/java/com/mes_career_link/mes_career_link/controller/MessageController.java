package com.mes_career_link.mes_career_link.controller;

import com.mes_career_link.mes_career_link.dto.ConversationDTO;
import com.mes_career_link.mes_career_link.dto.MessageRequestDTO;
import com.mes_career_link.mes_career_link.dto.SharePostDTO;
import com.mes_career_link.mes_career_link.entity.Message;
import com.mes_career_link.mes_career_link.entity.User;
import com.mes_career_link.mes_career_link.exception.UserNotFoundException;
import com.mes_career_link.mes_career_link.repository.UserRepository;
import com.mes_career_link.mes_career_link.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);

    private final MessageService messageService;
    private final UserRepository userRepository;

    @Autowired
    public MessageController(MessageService messageService, UserRepository userRepository) {
        this.messageService = messageService;
        this.userRepository = userRepository;
    }

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@Valid @RequestBody MessageRequestDTO messageRequestDTO) {
        logger.info("Sending message from {} to {}", messageRequestDTO.getSenderUsername(), messageRequestDTO.getReceiverUsername());
        try {
            Message message = messageService.sendMessage(
                    messageRequestDTO.getSenderUsername(),
                    messageRequestDTO.getReceiverUsername(),
                    messageRequestDTO.getContent()
            );
            return ResponseEntity.ok(message);
        } catch (UserNotFoundException e) {
            logger.error("Error sending message: {}", e.getMessage());
            return ResponseEntity.status(404).body(null);
        }
    }

    @GetMapping("/between/{username1}/{username2}")
    public ResponseEntity<List<Message>> getMessagesBetweenUsers(@PathVariable String username1, @PathVariable String username2) {
        logger.info("Fetching messages between {} and {}", username1, username2);
        String currentUsername = getCurrentUsername();
        if (!currentUsername.equals(username1) && !currentUsername.equals(username2)) {
            logger.warn("Unauthorized access attempt by user {}", currentUsername);
            return ResponseEntity.status(403).build(); // Forbidden
        }
        try {
            List<Message> messages = messageService.getMessagesBetweenUsers(username1, username2);
            return ResponseEntity.ok(messages);
        } catch (UserNotFoundException e) {
            logger.error("Error fetching messages: {}", e.getMessage());
            return ResponseEntity.status(404).body(null);
        }
    }

    @GetMapping("/conversations/{userId}")
    public ResponseEntity<List<ConversationDTO>> getUserConversations(@PathVariable Long userId) {
        logger.info("Fetching conversations for user ID {}", userId);
        Long currentUserId = getCurrentUserId();
        if (!currentUserId.equals(userId)) {
            logger.warn("Unauthorized access attempt by user {}", currentUserId);
            return ResponseEntity.status(403).build(); // Forbidden
        }
        List<ConversationDTO> conversations = messageService.getUserConversations(userId);
        if (conversations.isEmpty()) {
            logger.warn("No conversations found for user ID {}", userId);
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(conversations);
    }

    @PostMapping("/share")
    public ResponseEntity<?> sharePost(@Valid @RequestBody SharePostDTO sharePostDTO) {
        logger.info("Sharing post ID {} from user ID {} to user ID {}",
                sharePostDTO.getPostId(), sharePostDTO.getSenderId(), sharePostDTO.getReceiverId());
        try {
            messageService.sharePost(sharePostDTO);
            return ResponseEntity.ok("Post shared successfully");
        } catch (UserNotFoundException e) {
            logger.error("Error sharing post: {}", e.getMessage());
            return ResponseEntity.status(404).body("User not found");
        } catch (Exception e) {
            logger.error("Error sharing post: {}", e.getMessage());
            return ResponseEntity.status(500).body("Error sharing post");
        }
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            String username = ((UserDetails) authentication.getPrincipal()).getUsername();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UserNotFoundException("User not found"));
            return user.getId();
        }
        throw new IllegalStateException("Current user ID not found");
    }
}