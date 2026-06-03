package com.example.splits.application.query;

import com.example.splits.application.query.responses.GroupSummaryResponse;
import com.example.splits.application.query.responses.UserGroupResponse;
import com.example.splits.domain.expenses.Expense;
import com.example.splits.domain.expenses.IExpenseRepository;
import com.example.splits.domain.groups.Group;
import com.example.splits.domain.groups.IGroupRepository;
import com.example.splits.domain.services.SettlementDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GroupReadService {

    private final IGroupRepository groupRepository;
    private final IExpenseRepository expenseRepository;
    private final SettlementDomainService settlementService;

    @Transactional(readOnly = true)
    public GroupSummaryResponse getGroupSummary(UUID groupId, UUID userId) {

        var isUserInGroup = groupRepository.isUserInGroup(groupId, userId);

        if(!isUserInGroup){
            throw new AccessDeniedException("User is not in group");
        }

        var expenses = expenseRepository.findAllByGroupId(groupId);
        Map<UUID, BigDecimal> balances = new HashMap<>();

        for (Expense expense : expenses) {
            balances.merge(expense.getPayerId(), expense.getTotalAmount(), BigDecimal::add);

            expense.getItems().forEach(item -> {
                item.getSplits().forEach(split -> {
                    balances.merge(split.getDebtorId(), split.getAmount().negate(), BigDecimal::add);
                });
            });
        }

        var transactions = settlementService.calculateSettlements(balances);

        return new GroupSummaryResponse(transactions);

    }

    @Transactional(readOnly = true)
    public List<UserGroupResponse> getUserGroups(UUID userId) {

        var userGroups = groupRepository.findAllByUserId(userId);

        return userGroups.stream()
                .map(group -> new UserGroupResponse(
                        group.getGroupId(),
                        group.getName(),
                        group.getJoinCode()
                ))
                .toList();
    }
}
