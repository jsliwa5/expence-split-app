package com.example.splits.application.command;

import com.example.splits.application.dto.CreateGroupResponse;
import com.example.splits.shared.cqrs.Command;

import java.util.UUID;

public record CreateGroupCommand(
        UUID creatorId,
        String name
) implements Command<CreateGroupResponse> { }
