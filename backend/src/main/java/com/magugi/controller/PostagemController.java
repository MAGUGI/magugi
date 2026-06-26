package com.magugi.controller;

import com.magugi.entity.Postagem;
import com.magugi.service.PostagemService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/posts")
public class PostagemController {

    private final PostagemService service;

    public PostagemController(PostagemService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public Postagem findById(@PathVariable UUID id) {
        return service.findById(id);
    }

    @GetMapping("/forum/{forumId}")
    public Page<Postagem> findByForum(@PathVariable UUID forumId,
                                      Pageable pageable) {
        return service.findByForum(forumId, pageable);
    }

    @PostMapping
    public Postagem create(@RequestBody Postagem postagem) {
        return service.save(postagem);
    }

    @PutMapping("/{id}")
    public Postagem update(@PathVariable UUID id,
                           @RequestBody Postagem postagem) {
        postagem.setId(id);
        return service.save(postagem);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}