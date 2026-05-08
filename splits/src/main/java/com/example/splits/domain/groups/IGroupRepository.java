package com.example.splits.domain.groups;

import java.util.Optional;
import java.util.UUID;

public interface IGroupRepository {
    Group save(Group group);
    Optional<Group> findById(UUID id);
    Optional<Group> findByJoinCode(String joinCode);
}
