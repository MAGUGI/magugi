package com.magugi.controller;

import com.magugi.entity.Like;
import com.magugi.service.LikeService;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/likes")
public class LikeController {

    private final LikeService service;

    public LikeController(LikeService service) {
        this.service = service;
    }

    @PostMapping
    public Like create(@RequestBody Like like) {
        return service.save(like);
    }

    @GetMapping("/post/{postId}/count")
    public long countByPost(@PathVariable UUID postId) {
        return service.countByPost(postId);
    }

    @GetMapping("/comment/{commentId}/count")
    public long countByComment(@PathVariable UUID commentId) {
        return service.countByComment(commentId);
    }

    @DeleteMapping("/post/{postId}/user/{userId}")
    public void unlikePost(@PathVariable UUID postId,
                           @PathVariable UUID userId) {
        service.unlikePost(userId, postId);
    }

    @DeleteMapping("/comment/{commentId}/user/{userId}")
    public void unlikeComment(@PathVariable UUID commentId,
                              @PathVariable UUID userId) {
        service.unlikeComment(userId, commentId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
