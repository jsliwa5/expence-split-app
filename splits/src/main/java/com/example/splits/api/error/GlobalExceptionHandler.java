package com.example.splits.api.error;


import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalIdentifierException(IllegalArgumentException ex) {
        var error = new ErrorResponse(ex.getMessage());

        return ResponseEntity.badRequest().body(error.toString());
    }
}
