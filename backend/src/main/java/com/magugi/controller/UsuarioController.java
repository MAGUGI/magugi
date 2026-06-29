package com.magugi.controller;

import com.magugi.dto.UsuarioProfileResponse;
import com.magugi.entity.Usuario;
import com.magugi.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<Usuario> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public UsuarioProfileResponse findById(@PathVariable UUID id) {
        return service.getProfile(id);
    }

    @PostMapping
    public Usuario create(@RequestBody Usuario usuario) {
        return service.save(usuario);
    }
}