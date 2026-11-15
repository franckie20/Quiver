CREATE TABLE IF NOT EXISTS user_settings
(
    uuid           VARCHAR(36) PRIMARY KEY,
    name           VARCHAR(255),
    wishlist_items JSONB DEFAULT '[]'::jsonb
);