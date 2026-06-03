package com.example.splits.infrastructure.persistance;

import com.example.splits.domain.groups.Group;
import com.example.splits.domain.groups.IGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class GroupRepositoryImpl implements IGroupRepository {

    private final GroupJpaRepository jpaRepository;

    @Override
    public Group save(Group group) {
        return jpaRepository.save(group);
    }

    @Override
    public Optional<Group> findById(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Optional<Group> findByJoinCode(String joinCode) {
        return jpaRepository.findByJoinCode(joinCode);
    }

    @Override
    public boolean isUserInGroup(UUID groupId, UUID userId) {
        return jpaRepository.isUserInGroup(groupId, userId);
    }

    @Override
    public Set<UUID> findMemberIdsByGroupId(UUID groupId) {
        return jpaRepository.findMemberIdsByGroupId(groupId);
    }

    @Override
    public Set<Group> findAllByUserId(UUID userId) {
        return jpaRepository.findAllByUserId(userId);
    }
}
