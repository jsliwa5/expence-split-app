package com.example.splits.application.query;

import com.example.splits.application.query.responses.ExpenseSummaryResponse;
import com.example.splits.domain.expenses.IExpenseRepository;
import com.example.splits.domain.groups.IGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExpenseReadService {

    private final IExpenseRepository expenseRepository;
    private final IGroupRepository groupRepository;

    @Transactional(readOnly = true)
    public List<ExpenseSummaryResponse> getGroupExpenses(UUID groupId, UUID userId) {

        if (!groupRepository.isUserInGroup(groupId, userId)) {
            throw new AccessDeniedException("Odmowa dostępu: Nie należysz do tej grupy.");
        }

        var expenses = expenseRepository.findAllByGroupIdOrderByCreatedAtDesc(groupId);

        return expenses.stream()
                .map(expense -> new ExpenseSummaryResponse(
                        expense.getExpenseId(),
                        expense.getPayerId(),
                        expense.getDescription(),
                        expense.getTotalAmount(),
                        expense.getCreatedAt()
                ))
                .toList();
    }
}