package com.example.splits.infrastructure.security;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface SecurityUserJpaRepository extends JpaRepository<SecurityUserEntity, UUID> {
    Optional<SecurityUserEntity> findByEmail(String email);

    @Query("SELECT s.fcmToken FROM SecurityUserEntity s WHERE s.userId IN :userIds AND s.fcmToken IS NOT NULL")
    List<String> findFcmTokensByUserIds(@Param("userIds") Set<UUID> userIds);
}