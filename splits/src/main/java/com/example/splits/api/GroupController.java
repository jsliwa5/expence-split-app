package com.example.splits.api;

import com.example.splits.api.dto.CreateGroupRequest;
import com.example.splits.api.dto.JoinGroupRequest;
import com.example.splits.application.command.CreateGroupCommand;
import com.example.splits.application.command.JoinGroupByCodeCommand;
import com.example.splits.application.dto.CreateGroupResponse;
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
@RequestMapping("api/group")
@RequiredArgsConstructor
public class GroupController {

    private final CommandBus commandBus;
    private final QueryBus queryBus;

    @PostMapping()
    public ResponseEntity<CreateGroupResponse> createGroup(
            @RequestBody CreateGroupRequest createGroupRequest,
            @AuthenticationPrincipal CustomUserDetails user)
    {
        var creatorId = user.getUserId();
        var createGroupCommand = new CreateGroupCommand(
            creatorId,
            createGroupRequest.name()
        );

        var response = commandBus.execute(createGroupCommand);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/join")
    public ResponseEntity<UUID> joinGroupByJoinCode(
            @RequestBody JoinGroupRequest joinGroupRequest,
            @AuthenticationPrincipal CustomUserDetails user) {

        var userId = user.getUserId();
        var joinGroupByCodeCommand = new JoinGroupByCodeCommand(
                userId,
                joinGroupRequest.joinCode()
        );

        var response = commandBus.execute(joinGroupByCodeCommand);
        return ResponseEntity.ok(response);
    }
}
