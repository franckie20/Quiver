package com.franckie20.mapper;

import com.franckie20.entity.ProductEntity;
import com.franckie20.model.Product; // Generated OpenAPI DTO
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "cdi")
public interface ProductMapper {
    @Mapping(target = "sport", expression = "java(entity.sport != null ? Product.SportEnum.fromString(entity.sport) : null)")
    Product toDto(ProductEntity entity);

    @Mapping(target = "sport", expression = "java(dto.getSport() != null ? dto.getSport().value() : null)")
    ProductEntity toEntity(Product dto);
}