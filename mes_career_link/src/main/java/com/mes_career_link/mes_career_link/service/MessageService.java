package com.mes_career_link.mes_career_link.service;

import com.mes_career_link.mes_career_link.dto.ConversationDTO;
import com.mes_career_link.mes_career_link.dto.MessageDTO;
import com.mes_career_link.mes_career_link.dto.SharePostDTO;
import com.mes_career_link.mes_career_link.entity.Message;
import com.mes_career_link.mes_career_link.entity.Post;
import com.mes_career_link.mes_career_link.entity.User;
import com.mes_career_link.mes_career_link.exception.UserNotFoundException;
import com.mes_career_link.mes_career_link.repository.MessageRepository;
import com.mes_career_link.mes_career_link.repository.PostRepository;
import com.mes_career_link.mes_career_link.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository, UserRepository userRepository, PostRepository postRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public Message sendMessage(String senderUsername, String receiverUsername, String content) {
        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new UserNotFoundException("Sender not found"));
        User receiver = userRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new UserNotFoundException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setTimestamp(new Date());

        return messageRepository.save(message);
    }

    public List<Message> getMessagesBetweenUsers(String username1, String username2) {
        User user1 = userRepository.findByUsername(username1)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username1));
        User user2 = userRepository.findByUsername(username2)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username2));

        return messageRepository.findBySenderAndReceiverOrReceiverAndSender(user1, user2);
    }

    public List<ConversationDTO> getUserConversations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Message> messages = messageRepository.findDistinctBySenderIdOrReceiverId(userId);

        // Map to store the last message of each conversation
        Map<String, String> conversationMap = new HashMap<>();
        for (Message message : messages) {
            String otherUsername = message.getSender().getId().equals(userId)
                    ? message.getReceiver().getUsername()
                    : message.getSender().getUsername();
            // Assuming the latest message is added last in the list
            conversationMap.put(otherUsername, message.getContent());
        }

        // Convert the map to a list of ConversationDTO objects
        return conversationMap.entrySet().stream()
                .map(entry -> new ConversationDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public void sharePost(SharePostDTO sharePostDTO) {
        User sender = userRepository.findById(sharePostDTO.getSenderId())
                .orElseThrow(() -> new UserNotFoundException("Sender not found"));
        User receiver = userRepository.findById(sharePostDTO.getReceiverId())
                .orElseThrow(() -> new UserNotFoundException("Receiver not found"));
        Post post = postRepository.findById(sharePostDTO.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent("Shared post from " + sharePostDTO.getPostDetails().getUsername() + ":\n" +
                "Image: " + sharePostDTO.getPostDetails().getImageUrl() + "\n" +
                "Content: " + sharePostDTO.getPostDetails().getContent());
        message.setTimestamp(new Date());
        messageRepository.save(message);
    }
}