package com.magugi.repository;

import com.magugi.entity.Postagem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface PostagemRepository extends JpaRepository<Postagem, UUID> {

    @Query("SELECT p FROM Postagem p WHERE p.forum.id = :forumId AND (p.isRemoved = false OR p.isRemoved IS NULL)")
    Page<Postagem> findActiveByForumId(@Param("forumId") UUID forumId, Pageable pageable);

    @Query("SELECT p FROM Postagem p WHERE p.user.id = :userId AND (p.isRemoved = false OR p.isRemoved IS NULL)")
    Page<Postagem> findActiveByUserId(@Param("userId") UUID userId, Pageable pageable);
}