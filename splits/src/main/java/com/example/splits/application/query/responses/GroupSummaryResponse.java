package com.example.splits.application.query.responses;

import com.example.splits.domain.services.SettlementDomainService;

import java.util.List;

public record GroupSummaryResponse(
        List<SettlementDomainService.DebtTransaction> transactions
) {}
