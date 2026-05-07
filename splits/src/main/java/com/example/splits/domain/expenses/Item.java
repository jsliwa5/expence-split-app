package com.example.splits.domain.expenses;

import jakarta.persistence.Embeddable;
import lombok.Getter;

import java.math.BigDecimal;

//value object
@Embeddable
@Getter
public class Item {

    private String name;
    private BigDecimal price;
    private Double quantity;

    protected Item() {} //for Hibernate

    public Item(String name, BigDecimal price, Double quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
}
