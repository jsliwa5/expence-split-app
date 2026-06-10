package com.example.splits.domain.expenses;

import jakarta.persistence.*;
import lombok.Getter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "expenses")
@Getter
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID expenseId;

    @Column(nullable = false)
    private UUID groupId;

    @Column(nullable = false)
    private UUID payerId;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "expense_id", nullable = false, updatable = false)
    private List<ExpenseItem> items = new ArrayList<>();

    protected Expense() {} // for Hibernate

    public Expense(UUID groupId, UUID payerId, String description, BigDecimal totalAmount, List<ExpenseItem> items) {
        this.groupId = groupId;
        this.payerId = payerId;
        this.description = description;
        this.totalAmount = totalAmount;
        this.items = items != null ? items : new ArrayList<>();
        this.createdAt = LocalDateTime.now();

        validateInvariants();
    }

    public void update(String description, BigDecimal totalAmount, List<ExpenseItem> newItems) {
        this.description = description;
        this.totalAmount = totalAmount;

        this.items.clear();
        if (newItems != null) {
            this.items.addAll(newItems);
        }

        validateInvariants();
    }

    public void addItem(String name, BigDecimal price, List<ItemSplit> splits) {
        var newItem = new ExpenseItem(name, price, splits);
        this.items.add(newItem);
        this.totalAmount = this.totalAmount.add(price);

        validateInvariants();
    }

    private void validateInvariants() {
        var sumOfItems = this.items.stream()
                .map(ExpenseItem::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (sumOfItems.compareTo(this.totalAmount) != 0) {
            throw new IllegalArgumentException(
                    "Suma cen pozycji (" + sumOfItems + ") nie zgadza się z całkowitą kwotą paragonu (" + this.totalAmount + ")"
            );
        }

    }
}