package com.example.splits.domain.services;

import com.example.splits.domain.expenses.Split;
import com.example.splits.domain.expenses.SplitType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class SplitCalculatorDomainService {

    public List<Split> calculateEqualSplits(BigDecimal totalAmount, List<UUID> participantIds) {
        if (participantIds == null || participantIds.isEmpty()) {
            throw new IllegalArgumentException("List of participantIds is null or empty");
        }

        int numberOfParticipants = participantIds.size();

        BigDecimal baseAmount = totalAmount.divide(BigDecimal.valueOf(numberOfParticipants), 2, RoundingMode.DOWN);

        BigDecimal sumOfBaseAmounts = baseAmount.multiply(BigDecimal.valueOf(numberOfParticipants));
        BigDecimal remainder = totalAmount.subtract(sumOfBaseAmounts);

        List<Split> splits = new ArrayList<>();

        for (int i = 0; i < numberOfParticipants; i++) {
            BigDecimal owedAmount = baseAmount;

            if (i == 0) {
                owedAmount = owedAmount.add(remainder);
            }

            splits.add(new Split(participantIds.get(i), owedAmount, SplitType.EQUAL));
        }

        return splits;
    }
}