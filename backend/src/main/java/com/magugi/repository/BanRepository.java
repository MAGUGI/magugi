package com.magugi.repository;

import com.magugi.entity.Ban;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BanRepository extends JpaRepository<Ban, UUID> {
    List<Ban> findByUserId(UUID userId);
    Page<Ban> findByForumId(UUID forumId, Pageable pageable);
}