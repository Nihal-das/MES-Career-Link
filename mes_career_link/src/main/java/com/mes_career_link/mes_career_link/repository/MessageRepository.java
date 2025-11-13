package com.mes_career_link.mes_career_link.repository;

import com.mes_career_link.mes_career_link.entity.Message;
import com.mes_career_link.mes_career_link.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1)")
    List<Message> findBySenderAndReceiverOrReceiverAndSender(@Param("user1") User user1, @Param("user2") User user2);

    List<Message> findBySenderIdOrReceiverId(Long senderId, Long receiverId);

    @Query("SELECT DISTINCT m FROM Message m WHERE m.sender.id = :userId OR m.receiver.id = :userId")
    List<Message> findDistinctBySenderIdOrReceiverId(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Message m WHERE m.receiver.id = :receiverId")
    void deleteByReceiverId(@Param("receiverId") Long receiverId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Message m WHERE m.sender.id = :senderId OR m.receiver.id = :senderId")
    void deleteAllBySenderOrReceiver(@Param("senderId") Long senderId);
}