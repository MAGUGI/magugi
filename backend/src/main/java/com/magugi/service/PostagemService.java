package com.magugi.service;

import com.magugi.config.SecurityUtils;
import com.magugi.entity.Forum;
import com.magugi.entity.Postagem;
import com.magugi.entity.Usuario;
import com.magugi.repository.ForumRepository;
import com.magugi.repository.PostagemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PostagemService {

    private final PostagemRepository repository;
    private final ForumRepository forumRepository;
    private final SecurityUtils securityUtils;

    public PostagemService(PostagemRepository repository, ForumRepository forumRepository, SecurityUtils securityUtils) {
        this.repository = repository;
        this.forumRepository = forumRepository;
        this.securityUtils = securityUtils;
    }

    public Page<Postagem> findByForum(UUID forumId, Pageable pageable) {
        return repository.findActiveByForumId(forumId, pageable);
    }

    public Page<Postagem> findByUser(UUID userId, Pageable pageable) {
        return repository.findActiveByUserId(userId, pageable);
    }

    public Postagem findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postagem não encontrada"));
    }

    public Postagem save(Postagem postagem) {
        if (postagem.getIsRemoved() == null) {
            postagem.setIsRemoved(false);
        }
        if (postagem.getIsPinned() == null) {
            postagem.setIsPinned(false);
        }
        return repository.save(postagem);
    }

    @Transactional
    public void delete(UUID id) {
        Postagem postagem = findById(id);
        Usuario actor = securityUtils.getCurrentUser()
                .orElseThrow(() -> new AccessDeniedException("Autenticação necessária"));

        if (!canDelete(postagem, actor)) {
            throw new AccessDeniedException("Sem permissão para apagar esta publicação");
        }

        postagem.setIsRemoved(true);
        postagem.setRemovedBy(actor);
        repository.save(postagem);
    }

    private boolean canDelete(Postagem postagem, Usuario actor) {
        if (securityUtils.isAdmin(actor)) {
            return true;
        }
        if (securityUtils.isOwner(postagem.getUser().getId(), actor)) {
            return true;
        }
        Forum forum = forumRepository.findById(postagem.getForum().getId())
                .orElse(null);
        return securityUtils.isForumModerator(forum, actor);
    }
}
