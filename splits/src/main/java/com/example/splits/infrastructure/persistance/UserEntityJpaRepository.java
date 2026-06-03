package com.example.splits.infrastructure.persistance;

import com.example.splits.domain.users.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface UserEntityJpaRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByUsername(String username);

    @Query(value = "SELECT u.* FROM user_entity u JOIN group_members gm ON u.user_id = gm.user_id WHERE gm.group_id = :groupId", nativeQuery = true)
    Set<UserEntity> findUsersByGroupId(@Param("groupId") UUID groupId);
}
