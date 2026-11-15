package com.franckie20.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Entity
@Table(name = "user_settings")
public class UserSettingsEntity extends PanacheEntityBase {

    @Id
    @Column(length = 36)
    public String uuid;

    public String name;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "wishlist_items", columnDefinition = "jsonb")
    public List<DbWishlistItem> wishlistItems;

    public static class DbWishlistItem {
        public Long productId;
        public Integer quantity;
    }
}