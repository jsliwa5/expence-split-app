package com.example.splits.application.command;

import com.example.splits.domain.expenses.Expense;
import com.example.splits.domain.expenses.ExpenseItem;
import com.example.splits.domain.expenses.IExpenseRepository;
import com.example.splits.domain.expenses.ItemSplit;
import com.example.splits.domain.groups.IGroupRepository;
import com.example.splits.shared.cqrs.CommandHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddExpenseCommandHandler implements CommandHandler<AddExpenseCommand, UUID> {

    private final IExpenseRepository expenseRepository;
    private final IGroupRepository groupRepository;

    @Override
    @Transactional
    public UUID handle(AddExpenseCommand command) {

        var groupMemberIds = groupRepository.findMemberIdsByGroupId(command.groupId());

        var requiredUserIds = command.items().stream()
                .flatMap(item -> item.splits().stream())
                .map(AddExpenseCommand.SplitCommandDto::debtorId)
                .collect(Collectors.toSet());

        requiredUserIds.add(command.payerId());

        for (UUID userId : requiredUserIds) {
            if (!groupMemberIds.contains(userId)) {
                throw new IllegalArgumentException("User with id " + userId + " does not belong to this group");
            }
        }

        var expenseItems = command.items().stream()
                .map(itemDto -> {
                    var splits = itemDto.splits().stream()
                            .map(splitDto -> new ItemSplit(splitDto.debtorId(), splitDto.amount()))
                            .toList();

                    return new ExpenseItem(itemDto.name(), itemDto.price(), splits);
                })
                .toList();

        var expense = new Expense(
                command.groupId(),
                command.payerId(),
                command.description(),
                command.totalAmount(),
                expenseItems
        );

        var savedExpense = expenseRepository.save(expense);

        return savedExpense.getExpenseId();
    }
}