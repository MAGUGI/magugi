package com.magugi.repository;

import com.magugi.entity.Forum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ForumRepository extends JpaRepository<Forum, UUID> {
    Page<Forum> findAllByIsPrivateFalseAndIsQuarantinedFalse(Pageable pageable);
}