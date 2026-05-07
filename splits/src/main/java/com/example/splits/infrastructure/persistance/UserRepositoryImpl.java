package com.example.splits.infrastructure.persistance;

import com.example.splits.domain.users.IUserRepository;
import com.example.splits.domain.users.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements IUserRepository {

    private final UserEntityJpaRepository jpaRepository;

    @Override
    public UserEntity save(UserEntity user) {
        return jpaRepository.save(user);
    }

    @Override
    public Optional<UserEntity> findById(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Optional<UserEntity> findByUsername(String username) {
        return jpaRepository.findByUsername(username);
    }
}
