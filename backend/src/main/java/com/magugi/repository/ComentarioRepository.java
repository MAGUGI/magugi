package com.magugi.repository;

import com.magugi.entity.Comentario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ComentarioRepository extends JpaRepository<Comentario, UUID> {
    Page<Comentario> findByPostIdAndIsRemovedFalse(UUID postId, Pageable pageable);
    Page<Comentario> findByParentCommentIdAndIsRemovedFalse(UUID parentCommentId, Pageable pageable);
}