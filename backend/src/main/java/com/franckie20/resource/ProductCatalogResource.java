package com.franckie20.resource;


import com.franckie20.entity.ProductEntity;
import com.franckie20.mapper.ProductMapper;
import com.franckie20.model.Product;
import com.franckie20.resources.CatalogResource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductCatalogResource implements CatalogResource {
    @Inject
    ProductMapper productMapper;

    @Override
    public List<Product> getAllProducts() {
        List<ProductEntity> entities = ProductEntity.listAll();

        return entities.stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }
}
