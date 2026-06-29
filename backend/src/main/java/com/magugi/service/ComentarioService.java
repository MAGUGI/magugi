package com.magugi.service;

import com.magugi.config.SecurityUtils;
import com.magugi.entity.Comentario;
import com.magugi.entity.Forum;
import com.magugi.entity.Usuario;
import com.magugi.repository.ComentarioRepository;
import com.magugi.repository.ForumRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ComentarioService {

    private final ComentarioRepository repository;
    private final ForumRepository forumRepository;
    private final SecurityUtils securityUtils;

    public ComentarioService(ComentarioRepository repository, ForumRepository forumRepository, SecurityUtils securityUtils) {
        this.repository = repository;
        this.forumRepository = forumRepository;
        this.securityUtils = securityUtils;
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
        if (comentario.getIsRemoved() == null) {
            comentario.setIsRemoved(false);
        }
        return repository.save(comentario);
    }

    @Transactional
    public void delete(UUID id) {
        Comentario comentario = findById(id);
        Usuario actor = securityUtils.getCurrentUser()
                .orElseThrow(() -> new AccessDeniedException("Autenticação necessária"));

        if (!canDelete(comentario, actor)) {
            throw new AccessDeniedException("Sem permissão para apagar este comentário");
        }

        comentario.setIsRemoved(true);
        comentario.setRemovedBy(actor);
        repository.save(comentario);
    }

    private boolean canDelete(Comentario comentario, Usuario actor) {
        if (securityUtils.isAdmin(actor)) {
            return true;
        }
        if (securityUtils.isOwner(comentario.getUser().getId(), actor)) {
            return true;
        }
        Forum forum = forumRepository.findById(comentario.getPost().getForum().getId())
                .orElse(null);
        return securityUtils.isForumModerator(forum, actor);
    }
}
