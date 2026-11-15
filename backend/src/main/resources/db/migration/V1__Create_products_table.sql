CREATE SEQUENCE IF NOT EXISTS products_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE IF NOT EXISTS products
(
    id        BIGINT NOT NULL,
    sku       VARCHAR(255),
    title     VARCHAR(255),
    brand     VARCHAR(255),
    sport     VARCHAR(255),
    category  VARCHAR(255),
    price     DOUBLE PRECISION,
    currency  VARCHAR(255),
    stock     INTEGER,
    rating    DOUBLE PRECISION,
    imageUrl  TEXT,
    avatarUrl TEXT,
    CONSTRAINT pk_products PRIMARY KEY (id)
);