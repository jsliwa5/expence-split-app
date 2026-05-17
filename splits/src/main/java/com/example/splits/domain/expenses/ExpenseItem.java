package com.example.splits.domain.expenses;

import jakarta.persistence.*;
import lombok.Getter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "expense_items")
@Getter
public class ExpenseItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID itemId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "item_id", nullable = false, updatable = false)
    private List<ItemSplit> splits = new ArrayList<>();

    protected ExpenseItem() {} // for Hibernate

    public ExpenseItem(String name, BigDecimal price, List<ItemSplit> splits) {
        this.name = name;
        this.price = price;
        this.splits = splits;
    }
}