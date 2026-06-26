package com.magugi.repository;

import com.magugi.entity.Postagem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PostagemRepository extends JpaRepository<Postagem, UUID> {
    Page<Postagem> findByForumIdAndIsRemovedFalse(UUID forumId, Pageable pageable);
}