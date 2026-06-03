package com.example.splits.application.query.responses;

import java.util.UUID;

public record GroupMemberResponse(
        UUID userId,
        String firstName,
        String lastName,
        String username
) {}