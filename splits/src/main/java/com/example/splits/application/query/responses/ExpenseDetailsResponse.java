package com.example.splits.application.query.responses;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ExpenseDetailsResponse(
        UUID expenseId,
        UUID groupId,
        UUID payerId,
        String description,
        BigDecimal totalAmount,
        String receiptUrl, // <-- NOWE POLE (może być null)
        LocalDateTime createdAt,
        List<ItemDetailsResponse> items
) {
    public record ItemDetailsResponse(
            UUID itemId,
            String name,
            BigDecimal price,
            List<SplitDetailsResponse> splits
    ) {}

    public record SplitDetailsResponse(
            UUID debtorId,
            BigDecimal amount
    ) {}
}