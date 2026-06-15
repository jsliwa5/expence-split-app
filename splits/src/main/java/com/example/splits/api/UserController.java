package com.example.splits.api;

import com.example.splits.api.dto.UpdateFcmTokenRequest;
import com.example.splits.application.command.UpdateFcmTokenCommand;
import com.example.splits.infrastructure.security.CustomUserDetails;
import com.example.splits.shared.cqrs.CommandBus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final CommandBus commandBus;

    @PutMapping("/fcm-token")
    public ResponseEntity<Void> updateFcmToken(
            @RequestBody UpdateFcmTokenRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        var command = new UpdateFcmTokenCommand(
                currentUser.getUserId(),
                request.fcmToken()
        );

        commandBus.execute(command);
        return ResponseEntity.noContent().build();
    }
}