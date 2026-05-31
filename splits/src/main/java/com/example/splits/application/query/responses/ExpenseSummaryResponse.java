package com.example.splits.application.query.responses;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ExpenseSummaryResponse(
        UUID expenseId,
        UUID payerId,
        String description,
        BigDecimal totalAmount,
        LocalDateTime createdAt
) {}