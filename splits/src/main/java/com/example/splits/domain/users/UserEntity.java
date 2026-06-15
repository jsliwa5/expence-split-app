package com.example.splits.domain.users;

import jakarta.persistence.Column;
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

    @Column(name = "phone_number")
    private String phoneNumber;

    protected UserEntity() {}

    public UserEntity(UUID userId, String firstName, String lastName, String username, String phoneNumber) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;

        if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            if (!phoneNumber.matches("^\\+?[0-9]{9,15}$")) {
                throw new IllegalArgumentException("Invalid phone number format");
            }
            this.phoneNumber = phoneNumber.trim();
        } else {
            this.phoneNumber = null;
        }
    }
}