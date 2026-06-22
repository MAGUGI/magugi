package com.magugi.service;

import com.magugi.entity.Comentario;
import com.magugi.repository.ComentarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ComentarioService {

    private final ComentarioRepository repository;

    public ComentarioService(ComentarioRepository repository) {
        this.repository = repository;
    }

    public Page<Comentario> findByPost(UUID postId, Pageable pageable) {
        return repository.findByPostIdAndIsRemovedFalse(postId, pageable);
    }

    public Page<Comentario> findReplies(UUID parentId, Pageable pageable) {
        return repository.findByParentCommentIdAndIsRemovedFalse(parentId, pageable);
    }

    public Comentario findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comentário não encontrado"));
    }

    public Comentario save(Comentario comentario) {
        return repository.save(comentario);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}