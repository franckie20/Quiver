package com.franckie20.seeder;

import com.franckie20.entity.ProductEntity;
import com.franckie20.model.Product;
import jakarta.enterprise.context.ApplicationScoped;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@ApplicationScoped
public class MockProductDataGenerator implements ProductProvider {
    private static final int TOTAL_PRODUCTS = 64;
    private static final long RANDOM_SEED = 42L;

    private static final List<String> BRANDS = List.of("Duotone", "Cabrinha", "Core", "Naish", "North", "Slingshot", "F-One", "Ozone");
    private static final List<String> CATEGORIES = List.of("Kites", "Boards", "Wings", "Harnesses", "Foil Masts", "Accessories");

    @Override
    public List<ProductEntity> getProducts() {
        List<ProductEntity> products = new ArrayList<>();
        Product.SportEnum[] sports = Product.SportEnum.values();
        Random random = new Random(RANDOM_SEED);

        for (int i = 1; i <= TOTAL_PRODUCTS; i++) {
            ProductEntity product = new ProductEntity();

            Product.SportEnum sportEnum = sports[(i - 1) % sports.length];
            String sport = sportEnum.value();
            String brand = BRANDS.get(random.nextInt(BRANDS.size()));
            String category = CATEGORIES.get(random.nextInt(CATEGORIES.size()));

            product.sku = buildSku(brand, i);
            product.title = buildTitle(brand, sport, category, i);
            product.brand = brand;
            product.sport = sport;
            product.category = category;
            product.price = calculatePrice(random);
            product.currency = "USD";
            product.stock = 5 + random.nextInt(20);
            product.rating = calculateRating(random);
            product.imageUrl = URI.create(buildImageUrl(sport, i));
            product.avatarUrl = URI.create(buildAvatarUrl(brand));

            products.add(product);
        }

        return products;
    }

    private String buildSku(String brand, int index) {
        String prefix = brand.substring(0, Math.min(3, brand.length())).toUpperCase();
        return String.format("SKU-%s-%03d", prefix, index);
    }

    private String buildTitle(String brand, String sport, String category, int index) {
        int modelYear = 2024 + (index % 3);
        return String.format("%s %s %s Model %d", brand, sport, category, modelYear);
    }

    private double calculatePrice(Random random) {
        return Math.round((150.0 + (random.nextDouble() * 1600.0)) * 100.0) / 100.0;
    }

    private double calculateRating(Random random) {
        return Math.round((4.0 + (random.nextDouble())) * 10.0) / 10.0;
    }

    private String buildImageUrl(String sport, int index) {
        String keyword = sport.toLowerCase().replace(" ", "");
        return String.format("https://loremflickr.com/600/400/%s?lock=%d", keyword, index);
    }

    private String buildAvatarUrl(String brand) {
        return String.format("https://api.dicebear.com/9.x/initials/svg?seed=%s&backgroundColor=0284c7", brand);
    }
}