package com.example.splits.application.command;

import com.example.splits.domain.groups.IGroupRepository;
import com.example.splits.shared.cqrs.CommandHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JoincGroupByCodeCommandHandler implements CommandHandler<JoinGroupByCodeCommand, UUID> {

    private final IGroupRepository groupRepository;

    @Override
    @Transactional
    public UUID handle(JoinGroupByCodeCommand command) {
        var group = groupRepository.findByJoinCode(command.joinCode().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Could not find group with thin join code " + command.joinCode()));

        group.addMember(command.userId());
        groupRepository.save(group);

        return group.getGroupId();
    }
}
