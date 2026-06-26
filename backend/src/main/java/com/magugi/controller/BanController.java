package com.magugi.controller;

import com.magugi.entity.Ban;
import com.magugi.service.BanService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/bans")
public class BanController {

    private final BanService service;

    public BanController(BanService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public Ban findById(@PathVariable UUID id) {
        return service.findById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Ban> findByUser(@PathVariable UUID userId) {
        return service.findByUser(userId);
    }

    @GetMapping("/forum/{forumId}")
    public Page<Ban> findByForum(@PathVariable UUID forumId,
                                 Pageable pageable) {
        return service.findByForum(forumId, pageable);
    }

    @PostMapping
    public Ban create(@RequestBody Ban ban) {
        return service.save(ban);
    }

    @PutMapping("/{id}")
    public Ban update(@PathVariable UUID id,
                      @RequestBody Ban ban) {
        ban.setId(id);
        return service.save(ban);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
