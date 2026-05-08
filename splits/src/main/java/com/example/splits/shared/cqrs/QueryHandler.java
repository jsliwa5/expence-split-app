package com.example.splits.shared.cqrs;

public interface QueryHandler<Q extends Query<R>, R> {
    R handle(Q query);
}
