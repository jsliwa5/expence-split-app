package com.example.splits.application.command;

import com.example.splits.domain.expenses.Expense;
import com.example.splits.domain.expenses.IExpenseRepository;
import com.example.splits.domain.expenses.Split;
import com.example.splits.domain.services.SplitCalculatorDomainService;
import com.example.splits.shared.cqrs.CommandHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AddExpenseCommandHandler implements CommandHandler<AddExpenseCommand, UUID> {

    private final IExpenseRepository expenseRepository;
    private final SplitCalculatorDomainService splitCalculator;

    @Override
    @Transactional
    public UUID handle(AddExpenseCommand command) {
        var expense = new Expense(
                command.payerId(),
                command.groupId(),
                command.totalAmount()
        );

        var calculatedSplits = splitCalculator.calculateEqualSplits(
                command.totalAmount(),
                command.participantsIds()
        );

        expense.addSplits(calculatedSplits);
        var savedExpense = expenseRepository.save(expense);

        return savedExpense.getExpenseId();
    }
}
