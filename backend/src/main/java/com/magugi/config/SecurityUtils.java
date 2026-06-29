package com.magugi.config;

import com.magugi.entity.Forum;
import com.magugi.entity.Usuario;
import com.magugi.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class SecurityUtils {

    private final UsuarioRepository usuarioRepository;

    public SecurityUtils(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Optional<Usuario> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return Optional.empty();
        }
        return usuarioRepository.findByUsername(auth.getName());
    }

    public boolean isAdmin(Usuario user) {
        return user != null && Boolean.TRUE.equals(user.getIsAdmin());
    }

    public boolean isForumModerator(Forum forum, Usuario user) {
        if (user == null || forum == null || forum.getCreatedBy() == null) {
            return false;
        }
        return forum.getCreatedBy().getId().equals(user.getId());
    }

    public boolean canModerateForum(Forum forum, Usuario user) {
        return isAdmin(user) || isForumModerator(forum, user);
    }

    public boolean isOwner(UUID ownerId, Usuario user) {
        return user != null && ownerId != null && ownerId.equals(user.getId());
    }
}
