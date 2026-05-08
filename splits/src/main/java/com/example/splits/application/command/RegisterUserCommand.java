package com.example.splits.application.command;

import com.example.splits.shared.cqrs.Command;
import java.util.UUID;

public record RegisterUserCommand(
        String firstName,
        String lastName,
        String username,
        String email,
        String password
) implements Command<UUID> {}
