package com.magugi.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "bans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ban {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Usuario user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forum_id")
    private Forum forum;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "banned_by_user_id", nullable = false)
    private Usuario bannedBy;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "expires_at")
    private OffsetDateTime expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
}