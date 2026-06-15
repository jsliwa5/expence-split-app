package com.example.splits.application.command;

import com.example.splits.infrastructure.security.SecurityUserEntity;
import com.example.splits.infrastructure.security.SecurityUserJpaRepository;
import com.example.splits.shared.cqrs.CommandHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateFcmTokenCommandHandler implements CommandHandler<UpdateFcmTokenCommand, Void> {

    // Słusznie dodałeś fcmToken do SecurityUserEntity, więc używamy tego repozytorium
    private final SecurityUserJpaRepository securityUserRepository;

    @Override
    @Transactional
    public Void handle(UpdateFcmTokenCommand command) {

        SecurityUserEntity user = securityUserRepository.findById(command.userId())
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono użytkownika o podanym ID."));

        // Aktualizujemy token z telefonu
        user.setFcmToken(command.fcmToken());

        // Zapisujemy (choć dzięki @Transactional i tak by się zaktualizowało pod koniec transakcji)
        securityUserRepository.save(user);

        return null;
    }
}