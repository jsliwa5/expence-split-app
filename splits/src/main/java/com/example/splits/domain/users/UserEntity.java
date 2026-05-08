package com.example.splits.domain.users;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

import java.util.UUID;

@Entity
@Table(name = "user_entity")
@Getter
public class UserEntity {

    @Id
    private UUID userId;

    private String firstName;
    private String lastName;
    private String username;

    protected UserEntity() {}

    public UserEntity(UUID userId, String firstName, String lastName, String username) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
    }
}