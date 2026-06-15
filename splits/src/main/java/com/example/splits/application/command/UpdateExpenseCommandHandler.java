package com.example.splits.application.command;

import com.example.splits.domain.expenses.ExpenseItem;
import com.example.splits.domain.expenses.IExpenseRepository;
import com.example.splits.domain.expenses.ItemSplit;
import com.example.splits.domain.groups.IGroupRepository;
import com.example.splits.shared.cqrs.CommandHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UpdateExpenseCommandHandler implements CommandHandler<UpdateExpenseCommand, Void> {

    private final IExpenseRepository expenseRepository;
    private final IGroupRepository groupRepository;

    @Override
    @Transactional
    public Void handle(UpdateExpenseCommand command) {

        var expense = expenseRepository.findById(command.expenseId())
                .orElseThrow(() -> new IllegalArgumentException("Could not find expense with given ID: " + command.expenseId()));

        boolean isEditorInGroup = groupRepository.isUserInGroup(expense.getGroupId(), command.editorId());
        if (!isEditorInGroup) {
            throw new AccessDeniedException("You cannot edit expense if you don't belong to this group");
        }

        Set<UUID> groupMemberIds = groupRepository.findMemberIdsByGroupId(expense.getGroupId());

        Set<UUID> requiredUserIds = command.items().stream()
                .flatMap(item -> item.splits().stream())
                .map(UpdateExpenseCommand.SplitCommandDto::debtorId)
                .collect(Collectors.toSet());

        for (UUID userId : requiredUserIds) {
            if (!groupMemberIds.contains(userId)) {
                throw new IllegalArgumentException("User with ID: " + userId + " does not belong to this group!");
            }
        }

        var newExpenseItems = command.items().stream()
                .map(itemDto -> {
                    var splits = itemDto.splits().stream()
                            .map(splitDto -> new ItemSplit(splitDto.debtorId(), splitDto.amount()))
                            .toList();
                    return new ExpenseItem(itemDto.name(), itemDto.price(), splits);
                })
                .toList();

        expense.update(
                command.description(),
                command.totalAmount(),
                newExpenseItems,
                command.receiptUrl()
        );

        expenseRepository.save(expense);

        return null;
    }
}