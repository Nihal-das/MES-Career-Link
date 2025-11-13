package com.mes_career_link.mes_career_link.repository;

import com.mes_career_link.mes_career_link.entity.Post;
import com.mes_career_link.mes_career_link.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByTimestampDesc();

    // Add this method to find posts by a specific user, ordered by timestamp descending
    List<Post> findByUserOrderByTimestampDesc(User user);

    void deleteAllByUser(User user);
}