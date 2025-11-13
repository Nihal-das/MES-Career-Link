package com.mes_career_link.mes_career_link.repository;

import com.mes_career_link.mes_career_link.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    List<User> findByUsernameContaining(String username);

    Optional<User> findByEmail(String email);

    List<User> findByApproved(boolean approved);
}