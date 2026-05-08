package com.example.splits.api;

import com.example.splits.application.command.RegisterUserCommand;
import com.example.splits.application.dto.AuthResponse;
import com.example.splits.application.query.LoginQuery;
import com.example.splits.shared.cqrs.CommandBus;
import com.example.splits.shared.cqrs.QueryBus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final CommandBus commandBus;
    private final QueryBus queryBus;

    @PostMapping("/register")
    public ResponseEntity<UUID> register(@RequestBody RegisterUserCommand command) {
        var userId = commandBus.execute(command);
        return ResponseEntity.ok(userId);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginQuery query) {
        var response = queryBus.execute(query);
        return ResponseEntity.ok(response);
    }
}
