package com.example.splits.application.command;

import com.example.splits.shared.cqrs.Command;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record AddExpenseCommand(
        UUID groupId,
        UUID payerId,
        BigDecimal totalAmount,
        List<UUID> participantsIds
) implements Command<UUID> { }
