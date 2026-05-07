package com.example.splits.domain.groups;

import jakarta.persistence.*;
import lombok.Getter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "groups")
@Getter
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID groupId;

    @Column(nullable = false)
    private String name;

    @ElementCollection
    @CollectionTable(name = "group_members", joinColumns = @JoinColumn(name = "group_id"))
    @Column(name = "user_id")
    private List<UUID> membersIds = new ArrayList<>();

    protected Group() {}

    public Group(String name) {
        this.name = name;
    }

    public void addMember(UUID userId) {
        if (!this.membersIds.contains(userId)) {
            this.membersIds.add(userId);
        }
    }
}