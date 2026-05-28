package com.example.splits.api.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record UpdateExpenseRequest(
        String description,
        BigDecimal totalAmount,
        List<ItemRequestDto> items
) {
    public record ItemRequestDto(String name, BigDecimal price, List<SplitRequestDto> splits) {}
    public record SplitRequestDto(UUID debtorId, BigDecimal amount) {}
}