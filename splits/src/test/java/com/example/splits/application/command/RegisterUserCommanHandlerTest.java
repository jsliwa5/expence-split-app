package com.example.splits.application.command;

import com.example.splits.domain.users.IUserRepository;
import com.example.splits.domain.users.UserEntity;
import com.example.splits.infrastructure.security.SecurityUserEntity;
import com.example.splits.infrastructure.security.SecurityUserJpaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegisterUserCommandHandlerTest {

    @Mock
    private IUserRepository userRepository;

    @Mock
    private SecurityUserJpaRepository securityRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private RegisterUserCommandHandler handler;

    @Test
    @DisplayName("Powinien zarejestrować użytkownika i zapisać w obu repozytoriach")
    void shouldRegisterUserSuccessfully() {
        // GIVEN
        var command = new RegisterUserCommand("Jan", "Kowalski", "jankowalski", "jan@test.com", "Haslo123");

        when(securityRepository.findByEmail(command.email())).thenReturn(Optional.empty());
        when(userRepository.findByUsername(command.username())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(command.password())).thenReturn("encoded_password");

        // WHEN
        UUID newUserId = handler.handle(command);

        // THEN
        assertNotNull(newUserId);
        verify(userRepository, times(1)).save(any(UserEntity.class));
        verify(securityRepository, times(1)).save(any(SecurityUserEntity.class));
    }

    @Test
    @DisplayName("Powinien zablokować rejestrację, gdy email jest już zajęty")
    void shouldThrowExceptionWhenEmailIsTaken() {
        // GIVEN
        var command = new RegisterUserCommand("Jan", "Kowalski", "jankowalski", "zajety@test.com", "Haslo123");

        when(securityRepository.findByEmail(command.email())).thenReturn(Optional.of(mock(SecurityUserEntity.class)));

        // WHEN & THEN
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> handler.handle(command));

        verify(userRepository, never()).save(any());
        verify(securityRepository, never()).save(any());
    }
}