package com.example.splits.domain.expenses;

import jakarta.persistence.*;
import lombok.Getter;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "splits")
@Getter
public class Split {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID splitId;

    @Column(nullable = false)
    private UUID debtorId;

    @Column(nullable = false)
    private BigDecimal owedAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SplitType type;

    protected Split() {} //for Hibernate

    public Split(UUID debtorId, BigDecimal owedAmount, SplitType type) {
        this.debtorId = debtorId;
        this.owedAmount = owedAmount;
        this.type = type;
    }
}