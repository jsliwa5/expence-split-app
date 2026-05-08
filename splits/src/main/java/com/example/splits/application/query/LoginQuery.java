package com.example.splits.application.query;

import com.example.splits.application.dto.AuthResponse;
import com.example.splits.shared.cqrs.Query;

public record LoginQuery(
        String email,
        String password
) implements Query<AuthResponse> {}
