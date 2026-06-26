package com.magugi.service;

import com.magugi.entity.Ban;
import com.magugi.repository.BanRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BanService {

    private final BanRepository repository;

    public BanService(BanRepository repository) {
        this.repository = repository;
    }

    public List<Ban> findByUser(UUID userId) {
        return repository.findByUserId(userId);
    }

    public Page<Ban> findByForum(UUID forumId, Pageable pageable) {
        return repository.findByForumId(forumId, pageable);
    }

    public Ban findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ban não encontrado"));
    }

    public Ban save(Ban ban) {
        return repository.save(ban);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
