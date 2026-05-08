package com.example.splits.application.command;

import com.example.splits.application.dto.CreateGroupResponse;
import com.example.splits.domain.groups.Group;
import com.example.splits.domain.groups.IGroupRepository;
import com.example.splits.shared.cqrs.CommandHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class CreateGroupCommandHandler implements CommandHandler<CreateGroupCommand, CreateGroupResponse> {

    private final IGroupRepository groupRepository;

    @Override
    @Transactional
    public CreateGroupResponse handle(CreateGroupCommand command) {
        var group = new Group(command.name());
        group.addMember(command.creatorId());

        var savedGroup = groupRepository.save(group);

        return new CreateGroupResponse(
                savedGroup.getGroupId(),
                savedGroup.getJoinCode()
        );
    }
}
