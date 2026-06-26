package com.magugi.service;

import com.magugi.entity.Postagem;
import com.magugi.repository.PostagemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PostagemService {

    private final PostagemRepository repository;

    public PostagemService(PostagemRepository repository) {
        this.repository = repository;
    }

    public Page<Postagem> findByForum(UUID forumId, Pageable pageable) {
        return repository.findByForumIdAndIsRemovedFalse(forumId, pageable);
    }

    public Postagem findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postagem não encontrada"));
    }

    public Postagem save(Postagem postagem) {
        return repository.save(postagem);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}