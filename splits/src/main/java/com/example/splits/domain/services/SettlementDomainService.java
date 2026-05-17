package com.example.splits.domain.services;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service
public class SettlementDomainService {


    public record DebtTransaction(UUID fromUserId, UUID toUserId, BigDecimal amount) {}

    public List<DebtTransaction> calculateSettlements(Map<UUID, BigDecimal> balances) {

        class UserBalance {
            final UUID userId;
            BigDecimal amount;
            UserBalance(UUID userId, BigDecimal amount) { this.userId = userId; this.amount = amount; }
        }

        List<UserBalance> debtors = new ArrayList<>();
        List<UserBalance> creditors = new ArrayList<>();

        balances.forEach((userId, amount) -> {
            if (amount.compareTo(BigDecimal.ZERO) < 0) {
                debtors.add(new UserBalance(userId, amount.abs()));
            } else if (amount.compareTo(BigDecimal.ZERO) > 0) {
                creditors.add(new UserBalance(userId, amount));
            }
        });

        debtors.sort((a, b) -> b.amount.compareTo(a.amount));
        creditors.sort((a, b) -> b.amount.compareTo(a.amount));

        List<DebtTransaction> transactions = new ArrayList<>();
        int i = 0;
        int j = 0;

        while (i < debtors.size() && j < creditors.size()) {
            UserBalance debtor = debtors.get(i);
            UserBalance creditor = creditors.get(j);

            BigDecimal settledAmount = debtor.amount.min(creditor.amount);

            transactions.add(new DebtTransaction(debtor.userId, creditor.userId, settledAmount));

            debtor.amount = debtor.amount.subtract(settledAmount);
            creditor.amount = creditor.amount.subtract(settledAmount);

            if (debtor.amount.compareTo(BigDecimal.ZERO) == 0) i++;
            if (creditor.amount.compareTo(BigDecimal.ZERO) == 0) j++;
        }

        return transactions;
    }
}
