package com.mes_career_link.mes_career_link.service;

import com.mes_career_link.mes_career_link.entity.Comment;
import com.mes_career_link.mes_career_link.entity.Post;
import com.mes_career_link.mes_career_link.entity.User;
import com.mes_career_link.mes_career_link.repository.CommentRepository;
import com.mes_career_link.mes_career_link.repository.PostRepository;
import com.mes_career_link.mes_career_link.repository.UserRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    @Autowired
    public PostService(PostRepository postRepository, UserRepository userRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    @Transactional
    public Post createPost(Long userId, MultipartFile image, String content) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Save the image file
        String imagePath = saveImage(image);

        Post post = new Post();
        post.setUser(user);
        post.setImageUrl(imagePath);
        post.setContent(content);
        post.setTimestamp(new Date());
        post.setLikes(0);
        return postRepository.save(post);
    }

    private String saveImage(MultipartFile image) {
        String folderPath = "src/main/resources/static/uploads/"; // Replace with your directory path
        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        try {
            Files.createDirectories(Paths.get(folderPath)); // Ensure the directory exists
            Files.copy(image.getInputStream(), Paths.get(folderPath + fileName));
            return "/uploads/" + fileName; // Return the relative path to be served by the static resource handler
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image", e);
        }
    }

    @Transactional(readOnly = true)
    public List<Post> getAllPosts() {
        List<Post> posts = postRepository.findAllByOrderByTimestampDesc();
        posts.forEach(post -> {
            Hibernate.initialize(post.getLikedByUsers());
            Hibernate.initialize(post.getComments());
        });
        return posts;
    }

    @Transactional(readOnly = true)
    public List<Post> getPostsByUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<Post> posts = postRepository.findByUserOrderByTimestampDesc(user);
        posts.forEach(post -> {
            Hibernate.initialize(post.getLikedByUsers());
            Hibernate.initialize(post.getComments());
        });
        return posts;
    }

    @Transactional
    public Post toggleLikePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        Set<User> likedByUsers = post.getLikedByUsers();

        if (likedByUsers.contains(user)) {
            likedByUsers.remove(user);
            post.setLikes(post.getLikes() - 1);
        } else {
            likedByUsers.add(user);
            post.setLikes(post.getLikes() + 1);
        }

        return postRepository.save(post);
    }

    @Transactional
    public Comment addComment(Long postId, Long userId, String content) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(content);
        comment.setTimestamp(new Date());

        return commentRepository.save(comment);
    }

    @Transactional
    public void deletePost(Long postId, Long userId) {
        logger.info("Attempting to delete post with ID: {} by user ID: {}", postId, userId); // Add logging here
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        if (!post.getUser().getId().equals(userId)) {
            logger.warn("User ID: {} is not allowed to delete post with ID: {}", userId, postId); // Add logging here
            throw new IllegalArgumentException("User is not allowed to delete this post");
        }
        postRepository.delete(post);
        logger.info("Post with ID: {} deleted successfully by user ID: {}", postId, userId);
    }

    @Transactional
    public void sharePost(Long postId, Long userId, Long recipientId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        User recipient = userRepository.findById(recipientId).orElseThrow(() -> new IllegalArgumentException("Recipient not found"));

        // Implement the logic to share the post with the recipient
        // For example, you could create a new message or notification in the database

        // Log the share action
        logger.info("User ID: {} shared post ID: {} with recipient ID: {}", userId, postId, recipientId);
    }
}