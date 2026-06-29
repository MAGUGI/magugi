package com.magugi.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Builder
public class UsuarioProfileResponse {
    private UUID id;
    private String username;
    private String email;
    private Boolean isAdmin;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
