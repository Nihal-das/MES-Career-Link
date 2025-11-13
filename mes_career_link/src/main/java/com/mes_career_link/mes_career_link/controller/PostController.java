package com.mes_career_link.mes_career_link.controller;

import com.mes_career_link.mes_career_link.dto.CommentDTO;
import com.mes_career_link.mes_career_link.dto.PostDTO;
import com.mes_career_link.mes_career_link.entity.Comment;
import com.mes_career_link.mes_career_link.entity.Post;
import com.mes_career_link.mes_career_link.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.mes_career_link.mes_career_link.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {

    private final PostService postService;
    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public Post createPost(
            @RequestParam("userId") Long userId,
            @RequestParam("image") MultipartFile image,
            @RequestParam("content") String content) {
        return postService.createPost(userId, image, content);
    }

    @GetMapping
    public List<PostDTO> getAllPosts() {
        return postService.getAllPosts().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @GetMapping("/user/{username}")
    public List<PostDTO> getPostsByUser(@PathVariable String username) {
        return postService.getPostsByUser(username).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> toggleLikePost(@PathVariable Long postId, @RequestParam Long userId) {
        try {
            Post post = postService.toggleLikePost(postId, userId);
            boolean isLiked = post.getLikedByUsers().stream().anyMatch(user -> user.getId().equals(userId));
            return ResponseEntity.ok(Map.of(
                    "likes", post.getLikes(),
                    "isLiked", isLiked
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{postId}/comment")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable @NotNull Long postId,
            @RequestParam @NotNull Long userId,
            @RequestParam @NotNull String content) {
        Comment comment = postService.addComment(postId, userId, content);
        return ResponseEntity.ok(convertCommentToDTO(comment));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId, @RequestParam Long userId) {
        try {
            postService.deletePost(postId, userId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Return a bad request response if user is not allowed to delete the post
        }
    }

    @PostMapping("/{postId}/share")
    public ResponseEntity<?> sharePost(@PathVariable Long postId, @RequestParam Long userId, @RequestParam Long recipientId) {
        try {
            postService.sharePost(postId, userId, recipientId);
            return ResponseEntity.ok("Post shared successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sharing post.");
        }
    }

    private PostDTO convertToDTO(Post post) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setImageUrl(post.getImageUrl());
        dto.setTimestamp(post.getTimestamp());
        dto.setLikes(post.getLikes());
        dto.setContent(post.getContent());
        dto.setUsername(post.getUser().getUsername());
        dto.setProfileImageUrl(post.getUser().getProfileImageUrl()); // Add this line to include the profile image URL
        dto.setLikedByUsernames(post.getLikedByUsers().stream().map(User::getUsername).collect(Collectors.toList()));
        dto.setComments(post.getComments().stream().map(this::convertCommentToDTO).collect(Collectors.toList()));
        return dto;
    }


    private CommentDTO convertCommentToDTO(Comment comment) {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setId(comment.getId());
        commentDTO.setContent(comment.getContent());
        commentDTO.setUsername(comment.getUser().getUsername());
        commentDTO.setTimestamp(comment.getTimestamp());
        return commentDTO;
    }
}