package com.example.splits.infrastructure.persistance;

import com.example.splits.domain.groups.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface GroupJpaRepository extends JpaRepository<Group, UUID> {
    Optional<Group> findByJoinCode(String joinCode);
}
