package com.franckie20.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

import java.net.URI;

@Entity(name = "products")
public class ProductEntity extends PanacheEntity {
    public Long id;
    public String sku;
    public String title;
    public String brand;
    public String sport;
    public String category;
    public Double price;
    public String currency;
    public Integer stock;
    public Double rating;
    public URI imageUrl;
    public URI avatarUrl;
}
