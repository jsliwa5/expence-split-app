package com.example.splits.api.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record AddExpenseRequest(
        UUID groupId,
        String description,
        BigDecimal totalAmount,
        String receiptUrl,
        List<ItemRequestDto> items
) {
    public record ItemRequestDto(
            String name,
            BigDecimal price,
            List<SplitRequestDto> splits
    ) {}

    public record SplitRequestDto(
            UUID debtorId,
            BigDecimal amount
    ) {}
}