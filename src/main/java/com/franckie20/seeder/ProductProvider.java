package com.franckie20.seeder;

import com.franckie20.entity.ProductEntity;
import java.util.List;

public interface ProductProvider {
    List<ProductEntity> getProducts();
}