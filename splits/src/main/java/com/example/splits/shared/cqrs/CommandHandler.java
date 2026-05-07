package com.example.splits.shared.cqrs;

public interface CommandHandler<C extends Command<R>, R> {
    R handle (C command);
}
