package com.example.splits.application.command;

import com.example.splits.shared.cqrs.Command;
import java.util.UUID;

public record DeleteExpenseCommand(
        UUID expenseId,
        UUID requesterId
) implements Command<Void> {}