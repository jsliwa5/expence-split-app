package com.example.splits;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SplitsApplication {

    public static void main(String[] args) {
        SpringApplication.run(SplitsApplication.class, args);
    }

}
