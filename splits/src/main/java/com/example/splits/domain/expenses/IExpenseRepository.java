package com.example.splits.domain.expenses;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IExpenseRepository {

    Expense save(Expense expense);
    Optional<Expense> findById(UUID id);
    List<Expense> findAllByGroupId(UUID groupId);
    List<Expense> findAllByGroupIdOrderByCreatedAtDesc(UUID groupId);
}
