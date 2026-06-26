package com.magugi.service;

import com.magugi.entity.Usuario;
import com.magugi.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> findAll() {
        return repository.findAll();
    }

    public Usuario save(Usuario usuario) {
        usuario.setIsAdmin(false);
        String senhaPlana = usuario.getPasswordHash();
        String senhaCriptografada = passwordEncoder.encode(senhaPlana);
        usuario.setPasswordHash(senhaCriptografada);
        return repository.save(usuario);
    }
}