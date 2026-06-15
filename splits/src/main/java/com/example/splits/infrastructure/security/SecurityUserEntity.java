package com.example.splits.infrastructure.security;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

@Entity
@Table(name = "security_user")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SecurityUserEntity {

    @Id
    private UUID userId;
    private String email;
    private String passwordHash;

    @Column(name = "fcm_token")
    @Setter(AccessLevel.PUBLIC)
    private String fcmToken;

    public SecurityUserEntity(UUID userId, String email, String passwordHash) {
        this.userId = userId;
        this.email = email;
        this.passwordHash = passwordHash;
        this.fcmToken = null;
    }
}


