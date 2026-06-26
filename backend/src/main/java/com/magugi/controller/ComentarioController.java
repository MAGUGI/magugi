package com.magugi.controller;

import com.magugi.entity.Comentario;
import com.magugi.service.ComentarioService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/comentarios")
public class ComentarioController {

    private final ComentarioService service;

    public ComentarioController(ComentarioService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public Comentario findById(@PathVariable UUID id) {
        return service.findById(id);
    }

    @GetMapping("/post/{postId}")
    public Page<Comentario> findByPost(@PathVariable UUID postId,
                                       Pageable pageable) {
        return service.findByPost(postId, pageable);
    }

    @GetMapping("/replies/{parentId}")
    public Page<Comentario> findReplies(@PathVariable UUID parentId,
                                        Pageable pageable) {
        return service.findReplies(parentId, pageable);
    }

    @PostMapping
    public Comentario create(@RequestBody Comentario comentario) {
        return service.save(comentario);
    }

    @PutMapping("/{id}")
    public Comentario update(@PathVariable UUID id,
                             @RequestBody Comentario comentario) {
        comentario.setId(id);
        return service.save(comentario);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}