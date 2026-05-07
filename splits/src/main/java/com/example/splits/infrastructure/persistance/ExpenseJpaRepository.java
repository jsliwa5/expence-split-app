package com.example.splits.infrastructure.persistance;

import com.example.splits.domain.expenses.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExpenseJpaRepository extends JpaRepository<Expense, UUID> {
    List<Expense> findAllByGroupId(UUID groupId);
}
