package com.magugi.controller;

import com.magugi.entity.Forum;
import com.magugi.service.ForumService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/forums")
public class ForumController {

    private final ForumService service;

    public ForumController(ForumService service) {
        this.service = service;
    }

    @GetMapping
    public Page<Forum> findAll(Pageable pageable) {
        return service.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Forum findById(@PathVariable UUID id) {
        return service.findById(id);
    }

    @PostMapping
    public Forum create(@RequestBody Forum forum) {
        return service.save(forum);
    }

    @PutMapping("/{id}")
    public Forum update(@PathVariable UUID id,
                        @RequestBody Forum forum) {
        forum.setId(id);
        return service.save(forum);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}