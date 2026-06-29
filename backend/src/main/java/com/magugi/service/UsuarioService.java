package com.magugi.service;

import com.magugi.config.SecurityUtils;
import com.magugi.dto.UsuarioProfileResponse;
import com.magugi.entity.Usuario;
import com.magugi.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityUtils securityUtils;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder, SecurityUtils securityUtils) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.securityUtils = securityUtils;
    }

    public List<Usuario> findAll() {
        return repository.findAll();
    }

    public Usuario findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));
    }

    public UsuarioProfileResponse getProfile(UUID id) {
        Usuario usuario = findById(id);
        boolean canSeeEmail = securityUtils.getCurrentUser()
                .map(viewer -> securityUtils.isOwner(usuario.getId(), viewer) || securityUtils.isAdmin(viewer))
                .orElse(false);

        UsuarioProfileResponse.UsuarioProfileResponseBuilder builder = UsuarioProfileResponse.builder()
                .id(usuario.getId())
                .username(usuario.getUsername())
                .isAdmin(usuario.getIsAdmin())
                .createdAt(usuario.getCreatedAt())
                .updatedAt(usuario.getUpdatedAt());

        if (canSeeEmail) {
            builder.email(usuario.getEmail());
        }

        return builder.build();
    }

    public Usuario save(Usuario usuario) {
        usuario.setIsAdmin(false);
        String senhaPlana = usuario.getPasswordHash();
        String senhaCriptografada = passwordEncoder.encode(senhaPlana);
        usuario.setPasswordHash(senhaCriptografada);
        return repository.save(usuario);
    }
}