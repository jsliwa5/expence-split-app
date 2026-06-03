package com.example.splits.application.query.responses;

import java.util.UUID;

public record UserGroupResponse(
        UUID groupId,
        String name,
        String joinCode
) {}