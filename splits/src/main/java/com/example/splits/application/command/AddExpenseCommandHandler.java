package com.example.splits.application.command;

import com.example.splits.domain.expenses.Expense;
import com.example.splits.domain.expenses.ExpenseItem;
import com.example.splits.domain.expenses.IExpenseRepository;
import com.example.splits.domain.expenses.ItemSplit;
import com.example.splits.domain.groups.IGroupRepository;
import com.example.splits.infrastructure.security.SecurityUserJpaRepository;
import com.example.splits.infrastructure.services.NotificationService;
import com.example.splits.shared.cqrs.CommandHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddExpenseCommandHandler implements CommandHandler<AddExpenseCommand, UUID> {

    private final IExpenseRepository expenseRepository;
    private final IGroupRepository groupRepository;

    private final SecurityUserJpaRepository securityUserRepository;
    private final NotificationService notificationService;

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
                expenseItems,
                command.receiptUrl()
        );

        var savedExpense = expenseRepository.save(expense);


        Set<UUID> usersToNotifyIds = groupMemberIds.stream()
                .filter(memberId -> !memberId.equals(command.payerId()))
                .collect(Collectors.toSet());

        if (!usersToNotifyIds.isEmpty()) {
            List<String> tokens = securityUserRepository.findFcmTokensByUserIds(usersToNotifyIds);

            if (!tokens.isEmpty()) {
                String title = "Nowy wydatek!";
                String body = "Dodano wydatek: " + command.description() + " na kwotę " + command.totalAmount() + " zł.";

                for (String token : tokens) {
                    notificationService.sendPushNotification(token, title, body);
                }
            }
        }

        return savedExpense.getExpenseId();
    }
}