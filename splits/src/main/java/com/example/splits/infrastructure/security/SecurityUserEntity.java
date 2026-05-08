package com.example.splits.infrastructure.security;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
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
}


