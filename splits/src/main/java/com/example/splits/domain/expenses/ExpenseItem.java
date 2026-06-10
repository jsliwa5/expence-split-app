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
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Nazwa pozycji nie może być pusta.");
        }
        if (price == null || price.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Cena pozycji nie może być ujemna.");
        }

        this.name = name;
        this.price = price;
        this.splits = splits != null ? splits : new ArrayList<>();

        validateSplitsSum();
    }

    private void validateSplitsSum() {
        var sumOfSplits = this.splits.stream()
                .map(ItemSplit::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (sumOfSplits.compareTo(this.price) != 0) {
            throw new IllegalArgumentException(
                    "Błąd w pozycji '" + this.name + "'. Suma długów (" + sumOfSplits + ") nie równa się cenie pozycji (" + this.price + ")"
            );
        }
    }
}