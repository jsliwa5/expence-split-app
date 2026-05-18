package com.example.splits.application.command;

import com.example.splits.domain.users.IUserRepository;
import com.example.splits.domain.users.UserEntity;
import com.example.splits.infrastructure.security.SecurityUserEntity;
import com.example.splits.infrastructure.security.SecurityUserJpaRepository;
import com.example.splits.shared.cqrs.CommandHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RegisterUserCommandHandler implements CommandHandler<RegisterUserCommand, UUID> {

    private final IUserRepository userRepository;
    private final SecurityUserJpaRepository securityRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UUID handle(RegisterUserCommand command) {


        if (securityRepository.findByEmail(command.email()).isPresent()) {
            throw new IllegalArgumentException("This email is already registered");
        }
        if (userRepository.findByUsername(command.username()).isPresent()) {
            throw new IllegalArgumentException("this username is already registered");
        }

        var sharedUserId = UUID.randomUUID();

        var userEntity = new UserEntity(
                sharedUserId,
                command.firstName(),
                command.lastName(),
                command.username()
        );
        userRepository.save(userEntity);

        var encodedPassword = passwordEncoder.encode(command.password());
        var securityUser = new SecurityUserEntity(sharedUserId, command.email(), encodedPassword);
        securityRepository.save(securityUser);

        return sharedUserId;
    }
}