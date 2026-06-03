package com.example.splits.application.query;

import com.example.splits.application.query.responses.ExpenseDetailsResponse;
import com.example.splits.application.query.responses.ExpenseSummaryResponse;
import com.example.splits.application.query.responses.UserGroupResponse;
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

    @Transactional(readOnly = true)
    public ExpenseDetailsResponse getExpenseDetails(UUID expenseId, UUID userId) {

        var expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono wydatku o ID: " + expenseId));


        if (!groupRepository.isUserInGroup(expense.getGroupId(), userId)) {
            throw new AccessDeniedException("Odmowa dostępu: Wydatek należy do grupy, w której Cię nie ma.");
        }

        var itemsResponse = expense.getItems().stream()
                .map(item -> new ExpenseDetailsResponse.ItemDetailsResponse(
                        item.getItemId(),
                        item.getName(),
                        item.getPrice(),
                        item.getSplits().stream()
                                .map(split -> new ExpenseDetailsResponse.SplitDetailsResponse(
                                        split.getDebtorId(),
                                        split.getAmount()
                                )).toList()
                )).toList();

        return new ExpenseDetailsResponse(
                expense.getExpenseId(),
                expense.getGroupId(),
                expense.getPayerId(),
                expense.getDescription(),
                expense.getTotalAmount(),
                expense.getCreatedAt(),
                itemsResponse
        );
    }

}