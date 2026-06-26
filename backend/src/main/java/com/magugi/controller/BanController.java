package com.magugi.controller;

import com.magugi.entity.Ban;
import com.magugi.repository.BanRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/bans")
public class BanController {

    private final BanRepository banRepository;

    public BanController(BanRepository banRepository) {
        this.banRepository = banRepository;
    }

    @GetMapping("/user/{userId}")
    public List<Ban> findByUserId(@PathVariable UUID userId) {
        return banRepository.findByUserId(userId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBan(@RequestBody Ban ban) {
        Ban savedBan = banRepository.save(ban);
        
        System.out.println("[AUDITORIA] - Nova penalidade aplicada. ID do Ban: " + savedBan.getId() + " | Motivo: " + savedBan.getReason());
        
        return ResponseEntity.ok(savedBan);
    }
}