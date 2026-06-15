package com.example.splits.api;

import com.example.splits.api.dto.AddExpenseRequest;
import com.example.splits.api.dto.UpdateExpenseRequest;
import com.example.splits.application.command.AddExpenseCommand;
import com.example.splits.application.command.DeleteExpenseCommand;
import com.example.splits.application.command.UpdateExpenseCommand;
import com.example.splits.application.query.ExpenseReadService;
import com.example.splits.application.query.responses.ExpenseDetailsResponse;
import com.example.splits.application.query.responses.ExpenseSummaryResponse;
import com.example.splits.infrastructure.security.CustomUserDetails;
import com.example.splits.shared.cqrs.CommandBus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/expense")
@RequiredArgsConstructor
public class ExpenseController {

    private final CommandBus commandBus;
    private final ExpenseReadService expenseReadService;

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
                request.receiptUrl(),
                itemsCommand
        );

        var expenseId = commandBus.execute(command);
        return ResponseEntity.ok(expenseId);
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<Void> updateExpense(
            @PathVariable UUID expenseId,
            @RequestBody UpdateExpenseRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        var itemsCommand = request.items().stream()
                .map(item -> new UpdateExpenseCommand.ItemCommandDto(
                        item.name(),
                        item.price(),
                        item.splits().stream()
                                .map(split -> new UpdateExpenseCommand.SplitCommandDto(split.debtorId(), split.amount()))
                                .toList()
                )).toList();

        var command = new UpdateExpenseCommand(
                expenseId,
                currentUser.getUserId(),
                request.description(),
                request.totalAmount(),
                request.receiptUrl(),
                itemsCommand
        );
        commandBus.execute(command);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("{groupId}/expenses")
    public ResponseEntity<List<ExpenseSummaryResponse>> getGroupExpenses(
            @PathVariable UUID groupId,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        var response = expenseReadService.getGroupExpenses(groupId, user.getUserId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpenseDetailsResponse> getExpenseDetails(
            @PathVariable UUID expenseId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        var response = expenseReadService.getExpenseDetails(expenseId, currentUser.getUserId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable UUID expenseId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        var command = new DeleteExpenseCommand(expenseId, currentUser.getUserId());
        commandBus.execute(command);

        return ResponseEntity.noContent().build();
    }


}
