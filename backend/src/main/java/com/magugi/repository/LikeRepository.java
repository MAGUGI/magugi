package com.magugi.repository;

import com.magugi.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface LikeRepository extends JpaRepository<Like, UUID> {
    Optional<Like> findByUserIdAndPostId(UUID userId, UUID postId);
    Optional<Like> findByUserIdAndCommentId(UUID userId, UUID commentId);
    long countByPostId(UUID postId);
    long countByCommentId(UUID commentId);
}