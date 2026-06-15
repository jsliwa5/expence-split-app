package com.example.splits.application.command;

import com.example.splits.domain.expenses.Expense;
import com.example.splits.domain.expenses.IExpenseRepository;
import com.example.splits.domain.groups.IGroupRepository;
import com.example.splits.infrastructure.security.SecurityUserJpaRepository;
import com.example.splits.infrastructure.services.NotificationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AddExpenseCommandHandlerTest {

    @Mock
    private IExpenseRepository expenseRepository;

    @Mock
    private IGroupRepository groupRepository;

    @Mock
    private SecurityUserJpaRepository securityUserRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AddExpenseCommandHandler handler;

    @Test
    @DisplayName("Powinien dodać wydatek, gdy wszyscy użytkownicy należą do grupy")
    void shouldAddExpenseWhenAllUsersInGroup() {
        UUID payerId = UUID.randomUUID();
        UUID groupId = UUID.randomUUID();
        UUID debtorId = UUID.randomUUID();

        var splitDto = new AddExpenseCommand.SplitCommandDto(debtorId, new BigDecimal("100.00"));
        var itemDto = new AddExpenseCommand.ItemCommandDto("Zakupy", new BigDecimal("100.00"), List.of(splitDto));

        var command = new AddExpenseCommand(payerId, groupId, "Opis", new BigDecimal("100.00"),"randomurl", List.of(itemDto));

        when(groupRepository.findMemberIdsByGroupId(groupId)).thenReturn(Set.of(payerId, debtorId));
        lenient().when(securityUserRepository.findFcmTokensByUserIds(any())).thenReturn(List.of());

        Expense savedExpense = mock(Expense.class);
        when(savedExpense.getExpenseId()).thenReturn(UUID.randomUUID());
        when(expenseRepository.save(any(Expense.class))).thenReturn(savedExpense);

        UUID resultId = handler.handle(command);

        assertNotNull(resultId);
        verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    @DisplayName("Powinien rzucić wyjątek, gdy dłużnik nie należy do grupy")
    void shouldThrowExceptionWhenDebtorNotInGroup() {
        UUID payerId = UUID.randomUUID();
        UUID groupId = UUID.randomUUID();
        UUID strangerId = UUID.randomUUID();

        var splitDto = new AddExpenseCommand.SplitCommandDto(strangerId, new BigDecimal("100.00"));
        var itemDto = new AddExpenseCommand.ItemCommandDto("Zakupy", new BigDecimal("100.00"), List.of(splitDto));

        var command = new AddExpenseCommand(payerId, groupId, "Opis", new BigDecimal("100.00"),"randomurl", List.of(itemDto));

        when(groupRepository.findMemberIdsByGroupId(groupId)).thenReturn(Set.of(payerId));

        assertThrows(IllegalArgumentException.class, () -> handler.handle(command));
        verify(expenseRepository, never()).save(any(Expense.class));
    }
}