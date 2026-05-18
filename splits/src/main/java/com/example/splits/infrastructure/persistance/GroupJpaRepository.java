package com.example.splits.infrastructure.persistance;

import com.example.splits.domain.groups.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface GroupJpaRepository extends JpaRepository<Group, UUID> {
    Optional<Group> findByJoinCode(String joinCode);

    @Query(value = "SELECT EXISTS(SELECT 1 FROM group_members WHERE group_id = :groupId AND user_id = :userId)", nativeQuery = true)
    boolean isUserInGroup(@Param("groupId") UUID groupId, @Param("userId") UUID userId);

    @Query(value = "SELECT user_id FROM group_members WHERE group_id = :groupId", nativeQuery = true)
    Set<UUID> findMemberIdsByGroupId(@Param("groupId") UUID groupId);
}
