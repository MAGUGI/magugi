package com.magugi.controller;

import com.magugi.entity.Usuario;
import com.magugi.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping
    public Usuario create(@RequestBody Usuario usuario) {
        return service.save(usuario);
    }
}