package com.example.splits.domain.services;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SettlementDomainServiceTest {

    private final SettlementDomainService service = new SettlementDomainService();

    @Test
    @DisplayName("Brak długów - bilans zerowy powinien zwrócić pustą listę transakcji")
    void shouldReturnEmptyListForZeroBalances() {
        // GIVEN
        Map<UUID, BigDecimal> balances = Map.of(
                UUID.randomUUID(), BigDecimal.ZERO,
                UUID.randomUUID(), BigDecimal.ZERO
        );

        // WHEN
        var transactions = service.calculateSettlements(balances);

        // THEN
        assertEquals(0, transactions.size());
    }

    @Test
    @DisplayName("Prosty dług: 1 dłużnik i 1 wierzyciel")
    void shouldSettleSimpleDebt() {
        // GIVEN
        UUID debtorId = UUID.randomUUID();
        UUID creditorId = UUID.randomUUID();


        Map<UUID, BigDecimal> balances = Map.of(
                debtorId, new BigDecimal("-50.00"),
                creditorId, new BigDecimal("50.00")
        );

        // WHEN
        var transactions = service.calculateSettlements(balances);

        // THEN
        assertEquals(1, transactions.size());
        assertEquals(debtorId, transactions.get(0).fromUserId());
        assertEquals(creditorId, transactions.get(0).toUserId());
        assertEquals(new BigDecimal("50.00"), transactions.get(0).amount());
    }

    @Test
    @DisplayName("Złożony łańcuszek długów: optymalizacja przelewów")
    void shouldOptimizeComplexDebtChain() {
        // GIVEN
        UUID alice = UUID.randomUUID();
        UUID bob = UUID.randomUUID();
        UUID charlie = UUID.randomUUID();
        UUID dave = UUID.randomUUID();


        Map<UUID, BigDecimal> balances = Map.of(
                alice, new BigDecimal("-100.00"),
                bob, new BigDecimal("-20.00"),
                charlie, new BigDecimal("30.00"),
                dave, new BigDecimal("90.00")
        );

        // WHEN
        var transactions = service.calculateSettlements(balances);

        // THEN
        BigDecimal totalDebt = new BigDecimal("120.00");

        BigDecimal totalCalculatedTransfers = transactions.stream()
                .map(SettlementDomainService.DebtTransaction::amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        assertEquals(totalDebt, totalCalculatedTransfers, "Suma przelewów nie pokrywa długu w pełni!");
    }
}