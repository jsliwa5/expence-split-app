package com.example.splits.application.command;

import com.example.splits.domain.expenses.IExpenseRepository;
import com.example.splits.shared.cqrs.CommandHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class DeleteExpenseCommandHandler implements CommandHandler<DeleteExpenseCommand, Void> {

    private final IExpenseRepository expenseRepository;

    @Override
    @Transactional
    public Void handle(DeleteExpenseCommand command) {

        var expense = expenseRepository.findById(command.expenseId())
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono wydatku o ID: " + command.expenseId()));

        if (!expense.getPayerId().equals(command.requesterId())) {
            throw new AccessDeniedException("Odmowa dostępu: Tylko osoba, która zapłaciła za ten wydatek, może go usunąć.");
        }

        expenseRepository.delete(expense);

        return null;
    }
}