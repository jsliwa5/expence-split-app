package com.example.splits.shared.cqrs;

import org.springframework.core.GenericTypeResolver;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class QueryBus {

    private final Map<Class<?>, QueryHandler<?, ?>> handlers = new HashMap<>();

    public QueryBus(List<QueryHandler<?, ?>> handlerBeans) {
        for (var handler : handlerBeans) {
            var queryType = GenericTypeResolver.resolveTypeArguments(handler.getClass(), QueryHandler.class)[0];
            handlers.put(queryType, handler);
        }
    }

    @SuppressWarnings("unchecked")
    public <R, Q extends Query<R>> R execute(Q query) {
        var handler = (QueryHandler<Q, R>) handlers.get(query.getClass());

        if (handler == null) {
            throw new IllegalArgumentException("No handler found for query: " + query.getClass().getSimpleName());
        }

        return handler.handle(query);
    }
}