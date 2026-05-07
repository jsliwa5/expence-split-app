package com.example.splits.domain.expenses;

import jakarta.persistence.*;
import lombok.Getter;
import java.math.BigDecimal;
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
    private UUID payerId;

    @Column(nullable = false)
    private UUID groupId;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @ElementCollection
    @CollectionTable(name = "expense_items", joinColumns = @JoinColumn(name = "expense_id"))
    private List<Item> items = new ArrayList<>();


    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "expense_id")
    private List<Split> splits = new ArrayList<>();

    protected Expense() {} // for Hibernate

    public Expense(UUID payerId, UUID groupId, BigDecimal totalAmount) {
        this.payerId = payerId;
        this.groupId = groupId;
        this.totalAmount = totalAmount;
    }

    public void addItem(Item item) {
        this.items.add(item);
    }

    public void addSplits(List<Split> calculatedSplits) {
        this.splits.addAll(calculatedSplits);
    }
}