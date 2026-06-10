package com.example.splits.application.command;

import com.example.splits.domain.expenses.Expense;
import com.example.splits.domain.expenses.IExpenseRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeleteExpenseCommandHandlerTest {

    @Mock
    private IExpenseRepository expenseRepository;

    @InjectMocks
    private DeleteExpenseCommandHandler handler;

    @Test
    @DisplayName("Powinien pomyślnie usunąć wydatek, gdy żądający jest jego płatnikiem")
    void shouldDeleteExpenseWhenRequesterIsPayer() {

        UUID expenseId = UUID.randomUUID();
        UUID payerId = UUID.randomUUID();
        DeleteExpenseCommand command = new DeleteExpenseCommand(expenseId, payerId);

        Expense expense = mock(Expense.class);
        when(expense.getPayerId()).thenReturn(payerId);

        when(expenseRepository.findById(expenseId)).thenReturn(Optional.of(expense));

        handler.handle(command);

        verify(expenseRepository, times(1)).delete(expense);
    }

    @Test
    @DisplayName("Powinien rzucić AccessDeniedException, gdy ktoś inny niż płatnik próbuje usunąć wydatek")
    void shouldThrowAccessDeniedExceptionWhenRequesterIsNotPayer() {
        // GIVEN
        UUID expenseId = UUID.randomUUID();
        UUID realPayerId = UUID.randomUUID();
        UUID hackerId = UUID.randomUUID();
        DeleteExpenseCommand command = new DeleteExpenseCommand(expenseId, hackerId);

        Expense expense = mock(Expense.class);
        when(expense.getPayerId()).thenReturn(realPayerId);
        when(expenseRepository.findById(expenseId)).thenReturn(Optional.of(expense));

        assertThrows(AccessDeniedException.class, () -> handler.handle(command));

        verify(expenseRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Powinien rzucić IllegalArgumentException, gdy wydatek nie istnieje w bazie danych")
    void shouldThrowIllegalArgumentExceptionWhenExpenseDoesNotExist() {
        UUID expenseId = UUID.randomUUID();
        DeleteExpenseCommand command = new DeleteExpenseCommand(expenseId, UUID.randomUUID());

        when(expenseRepository.findById(expenseId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> handler.handle(command));
        verify(expenseRepository, never()).delete(any());
    }
}