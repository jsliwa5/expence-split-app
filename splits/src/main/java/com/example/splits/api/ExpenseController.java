package com.example.splits.api;

import com.example.splits.api.dto.AddExpenseRequest;
import com.example.splits.application.command.AddExpenseCommand;
import com.example.splits.infrastructure.security.CustomUserDetails;
import com.example.splits.shared.cqrs.CommandBus;
import com.example.splits.shared.cqrs.QueryBus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("api/expense")
@RequiredArgsConstructor
public class ExpenseController {

    private final CommandBus commandBus;

    @PostMapping
    public ResponseEntity<UUID> addExpense(
            @RequestBody AddExpenseRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {

        var itemsCommand = request.items().stream()
                .map(item -> new AddExpenseCommand.ItemCommandDto(
                        item.name(),
                        item.price(),
                        item.splits().stream()
                                .map(split -> new AddExpenseCommand.SplitCommandDto(split.debtorId(), split.amount()))
                                .toList()
                )).toList();

        var command = new AddExpenseCommand(
                currentUser.getUserId(),
                request.groupId(),
                request.description(),
                request.totalAmount(),
                itemsCommand
        );

        var expenseId = commandBus.execute(command);
        return ResponseEntity.ok(expenseId);
    }
}
