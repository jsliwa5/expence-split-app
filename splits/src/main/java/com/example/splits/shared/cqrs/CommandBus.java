package com.example.splits.shared.cqrs;

import org.springframework.core.GenericTypeResolver;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CommandBus {
    private final Map<Class<?>, CommandHandler<?, ?>> handlers = new HashMap<>();

    public CommandBus(List<CommandHandler<?, ?>> handlerBeans) {
        for (CommandHandler<?, ?> handler : handlerBeans) {
            Class<?> commandType = GenericTypeResolver.resolveTypeArguments(handler.getClass(), CommandHandler.class)[0];
            handlers.put(commandType, handler);
        }
    }

    @SuppressWarnings("unchecked")
    public <R, C extends Command<R>> R execute(C command) {
        CommandHandler<C, R> handler = (CommandHandler<C, R>) handlers.get(command.getClass());

        if (handler == null) {
            throw new IllegalArgumentException("No handler found for command: " + command.getClass().getSimpleName());
        }

        return handler.handle(command);
    }
}
