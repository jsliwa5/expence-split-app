package com.example.splits.domain.expenses;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ExpenseItemTest {

    @Test
    @DisplayName("Powinien poprawnie utworzyć ExpenseItem, gdy suma długów jest równa cenie przedmiotu")
    void shouldCreateExpenseItemSuccessfully() {
        // GIVEN
        BigDecimal price = new BigDecimal("100.00");
        List<ItemSplit> splits = List.of(
                new ItemSplit(UUID.randomUUID(), new BigDecimal("60.00")),
                new ItemSplit(UUID.randomUUID(), new BigDecimal("40.00"))
        );

        // WHEN & THEN
        assertDoesNotThrow(() -> new ExpenseItem("Kebab", price, splits));
    }

    @Test
    @DisplayName("Powinien rzucić wyjątek, gdy suma długów jest mniejsza lub większa niż cena")
    void shouldThrowExceptionWhenSplitsDoNotMatchPrice() {
        // GIVEN
        BigDecimal price = new BigDecimal("100.00");
        List<ItemSplit> splits = List.of(
                new ItemSplit(UUID.randomUUID(), new BigDecimal("50.00")),
                new ItemSplit(UUID.randomUUID(), new BigDecimal("30.00")) // Suma = 80!
        );

        // WHEN & THEN
        assertThrows(IllegalArgumentException.class, () -> new ExpenseItem("Kebab", price, splits));
    }

    @Test
    @DisplayName("Powinien rzucić wyjątek dla ujemnej ceny")
    void shouldThrowExceptionForNegativePrice() {
        assertThrows(IllegalArgumentException.class, () ->
                new ExpenseItem("Kebab", new BigDecimal("-10.00"), List.of())
        );
    }
}