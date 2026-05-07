package com.example.splits.domain.users;

import java.util.Optional;
import java.util.UUID;

public interface IUserRepository {
    UserEntity save(UserEntity user);
    Optional<UserEntity> findById(UUID id);
    Optional<UserEntity> findByUsername(String username);
}
