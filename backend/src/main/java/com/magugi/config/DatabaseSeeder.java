package com.magugi.config;

import com.magugi.entity.Usuario;
import com.magugi.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() == 0) {
            System.out.println("[SEEDER] Banco vazio! Inserindo usuários de teste...");

            Usuario admin = Usuario.builder()
                    .username("admin")
                    .email("admin@magugi.com")
                    .passwordHash(passwordEncoder.encode("123456"))
                    .isAdmin(true)
                    .build();
            usuarioRepository.save(admin);

            Usuario comum = Usuario.builder()
                    .username("comum")
                    .email("comum@magugi.com")
                    .passwordHash(passwordEncoder.encode("123456"))
                    .isAdmin(false)
                    .build();
            usuarioRepository.save(comum);

            System.out.println("[SEEDER] Usuários de teste criados com sucesso.");
            System.out.println("-> Login Admin: admin | Senha: 123456");
            System.out.println("-> Login Comum: comum | Senha: 123456");
        }
    }
}