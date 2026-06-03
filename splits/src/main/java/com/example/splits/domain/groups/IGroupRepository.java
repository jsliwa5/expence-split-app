package com.example.splits.domain.groups;


import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface IGroupRepository {
    Group save(Group group);
    Optional<Group> findById(UUID id);
    Optional<Group> findByJoinCode(String joinCode);
    boolean isUserInGroup(UUID groupId, UUID userId);
    Set<UUID> findMemberIdsByGroupId(UUID groupId);
    Set<Group> findAllByUserId(UUID userId);
}
