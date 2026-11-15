package com.franckie20.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.net.URI;

@Converter(autoApply = true)
public class UriConverter implements AttributeConverter<URI, String> {

    @Override
    public String convertToDatabaseColumn(URI uri) {
        return (uri != null) ? uri.toString() : null;
    }

    @Override
    public URI convertToEntityAttribute(String dbData) {
        return (dbData != null && !dbData.isBlank()) ? URI.create(dbData) : null;
    }
}