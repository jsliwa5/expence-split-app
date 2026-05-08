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

    @Column(name = "join_code", nullable = false, unique = true, length = 6)
    private String joinCode;

    @ElementCollection
    @CollectionTable(name = "group_members", joinColumns = @JoinColumn(name = "group_id"))
    @Column(name = "user_id")
    private List<UUID> membersIds = new ArrayList<>();

    protected Group() {}

    public Group(String name) {
        this.name = name;
        this.joinCode = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    public void addMember(UUID userId) {
        if (!this.membersIds.contains(userId)) {
            this.membersIds.add(userId);
        }
    }
}