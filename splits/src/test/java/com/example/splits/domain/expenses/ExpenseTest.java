package com.example.splits.domain.expenses;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ExpenseTest {

    @Test
    @DisplayName("Powinien poprawnie utworzyć wydatek, gdy suma pozycji zgadza się z totalAmount")
    void shouldCreateExpenseSuccessfully() {
        // GIVEN
        UUID groupId = UUID.randomUUID();
        UUID payerId = UUID.randomUUID();
        BigDecimal totalAmount = new BigDecimal("100.00");

        List<ExpenseItem> items = List.of(
                new ExpenseItem("Kebab", new BigDecimal("50.00"), List.of(new ItemSplit(UUID.randomUUID(), new BigDecimal("50.00")))),
                new ExpenseItem("Pizza", new BigDecimal("50.00"), List.of(new ItemSplit(UUID.randomUUID(), new BigDecimal("50.00"))))
        );

        // WHEN & THEN
        assertDoesNotThrow(() -> new Expense(groupId, payerId, "Jedzenie", totalAmount, items));
    }

    @Test
    @DisplayName("Powinien rzucić wyjątek, gdy suma pozycji nie zgadza się z totalAmount")
    void shouldThrowExceptionWhenItemsSumDoesNotMatchTotalAmount() {
        // GIVEN
        UUID groupId = UUID.randomUUID();
        UUID payerId = UUID.randomUUID();
        BigDecimal totalAmount = new BigDecimal("100.00");

        List<ExpenseItem> items = List.of(
                new ExpenseItem("Kebab", new BigDecimal("50.00"), List.of(new ItemSplit(UUID.randomUUID(), new BigDecimal("50.00")))),
                new ExpenseItem("Cola", new BigDecimal("30.00"), List.of(new ItemSplit(UUID.randomUUID(), new BigDecimal("30.00"))))
        );

        // WHEN & THEN
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> new Expense(groupId, payerId, "Jedzenie", totalAmount, items));

        assertTrue(exception.getMessage().contains("nie zgadza się z całkowitą kwotą paragonu"));
    }
}