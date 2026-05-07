package com.example.splits.infrastructure.persistance;

import com.example.splits.domain.expenses.Expense;
import com.example.splits.domain.expenses.IExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class ExpenseRepositoryImpl implements IExpenseRepository {

    private final ExpenseJpaRepository jpaRepository;

    @Override
    public Expense save(Expense expense) {
        return jpaRepository.save(expense);
    }

    @Override
    public Optional<Expense> findById(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Expense> findAllByGroupId(UUID groupId) {
        return jpaRepository.findAllByGroupId(groupId);
    }
}
