package com.example.splits.application.dto;

import java.util.UUID;

public record CreateGroupResponse(
        UUID groupId,
        String joinCode
) { }
