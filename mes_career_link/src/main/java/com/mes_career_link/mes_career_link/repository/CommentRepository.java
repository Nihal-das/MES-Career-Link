package com.mes_career_link.mes_career_link.repository;

import com.mes_career_link.mes_career_link.entity.Comment;
import com.mes_career_link.mes_career_link.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    void deleteAllByUser(User user);
}