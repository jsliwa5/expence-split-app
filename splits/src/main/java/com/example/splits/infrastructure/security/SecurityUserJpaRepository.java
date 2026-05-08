package com.example.splits.infrastructure.security;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SecurityUserJpaRepository extends JpaRepository<SecurityUserEntity, UUID> {
    Optional<SecurityUserEntity> findByEmail(String email);
}