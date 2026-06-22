package com.magugi.service;

import com.magugi.entity.Forum;
import com.magugi.repository.ForumRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ForumService {

    private final ForumRepository repository;

    public ForumService(ForumRepository repository) {
        this.repository = repository;
    }

    public Page<Forum> findAll(Pageable pageable) {
        return repository.findAllByIsPrivateFalseAndIsQuarantinedFalse(pageable);
    }

    public Forum findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Forum não encontrado"));
    }

    public Forum save(Forum forum) {
        return repository.save(forum);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}