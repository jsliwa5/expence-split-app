package com.example.splits.application.command;

import com.example.splits.shared.cqrs.Command;

import java.util.UUID;

public record JoinGroupByCodeCommand(
        UUID userId,
        String joinCode
) implements Command<UUID> {}
