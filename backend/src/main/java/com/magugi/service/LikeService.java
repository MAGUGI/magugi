package com.magugi.service;

import com.magugi.entity.Like;
import com.magugi.repository.LikeRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class LikeService {

    private final LikeRepository repository;

    public LikeService(LikeRepository repository) {
        this.repository = repository;
    }

    public Like save(Like like) {
        return repository.save(like);
    }

    public long countByPost(UUID postId) {
        return repository.countByPostId(postId);
    }

    public long countByComment(UUID commentId) {
        return repository.countByCommentId(commentId);
    }

    public void unlikePost(UUID userId, UUID postId) {
        repository.findByUserIdAndPostId(userId, postId)
                .ifPresent(repository::delete);
    }

    public void unlikeComment(UUID userId, UUID commentId) {
        repository.findByUserIdAndCommentId(userId, commentId)
                .ifPresent(repository::delete);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
