package com.example.splits.domain.expenses;

import jakarta.persistence.*;
import lombok.Getter;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "item_splits")
@Getter
public class ItemSplit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID splitId;

    @Column(nullable = false)
    private UUID debtorId;

    @Column(nullable = false)
    private BigDecimal amount;

    protected ItemSplit() {} // for Hibernate

    public ItemSplit(UUID debtorId, BigDecimal amount) {
        this.debtorId = debtorId;
        this.amount = amount;
    }
}