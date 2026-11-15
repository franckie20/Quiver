package com.franckie20.seeder;

import com.franckie20.entity.ProductEntity;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;

import java.util.List;

@ApplicationScoped
public class CatalogSeeder {

    private static final Logger LOG = Logger.getLogger(CatalogSeeder.class);

    @Inject
    ProductProvider productProvider;

    @Transactional
    public void onStart(@Observes StartupEvent event) {
        if (ProductEntity.count() > 0) {
            LOG.info("Database already contains products. Skipping seeding.");
            return;
        }

        List<ProductEntity> products = productProvider.getProducts();

        for (ProductEntity product : products) {
            product.persist();
        }

        LOG.infof("Successfully seeded database with %d products.", products.size());
    }
}