package com.example.splits.application.command;

import com.example.splits.shared.cqrs.Command;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record UpdateExpenseCommand(
        UUID expenseId,
        UUID editorId,
        String description,
        BigDecimal totalAmount,
        List<ItemCommandDto> items
) implements Command<Void> {

    public record ItemCommandDto(
            String name,
            BigDecimal price,
            List<SplitCommandDto> splits
    ) {}

    public record SplitCommandDto(
            UUID debtorId,
            BigDecimal amount
    ) {}
}
