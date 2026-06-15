package com.example.splits.application.command;

import com.example.splits.shared.cqrs.Command;
import java.util.UUID;

public record UpdateFcmTokenCommand(
        UUID userId,
        String fcmToken
) implements Command<Void> {
}