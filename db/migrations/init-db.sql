CREATE TABLE "Categories"
(
    "id"       VARCHAR(36) PRIMARY KEY,
    "imageUrl" VARCHAR(255),
    "name"     VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE "Collections"
(
    "id"   VARCHAR(36) PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE "Products"
(
    "id"               VARCHAR(36) PRIMARY KEY,
    "name"             VARCHAR(255)   NOT NULL,
    "categoryId"       VARCHAR(36)    NOT NULL REFERENCES "Categories" ("id"),
    "shortDescription" TEXT,
    "fullDescription"  TEXT,
    "price"            NUMERIC(10, 2) NOT NULL CHECK ("price" >= 0),
    "discount"         NUMERIC(5, 2) DEFAULT 0 CHECK ("discount" >= 0 AND "discount" <= 100),
    "releaseDate"      DATE          DEFAULT CURRENT_DATE,
    "imagesUrls"       JSONB,

    UNIQUE ("name", "categoryId")
);

CREATE TABLE "CollectionsProducts"
(
    "collectionId" VARCHAR(36) NOT NULL REFERENCES "Collections" ("id") ON DELETE CASCADE,
    "productId"    VARCHAR(36) NOT NULL REFERENCES "Products" ("id") ON DELETE CASCADE,

    PRIMARY KEY ("collectionId", "productId")
);

CREATE TABLE "ProductsInventory"
(
    "productId"     VARCHAR(36) PRIMARY KEY REFERENCES "Products" ("id") ON DELETE CASCADE,
    "stockQuantity" INTEGER NOT NULL CHECK ("stockQuantity" >= 0)
);

CREATE TABLE "Users"
(
    "id"         VARCHAR(36) PRIMARY KEY,
    "name"       VARCHAR(255)        NOT NULL,
    "email"      VARCHAR(255) UNIQUE NOT NULL,
    "phone"      VARCHAR(50),
    "address"    VARCHAR(255),
    "postalCode" VARCHAR(20),
    "city"       VARCHAR(100),
    "country"    VARCHAR(100)
);

CREATE TABLE "Orders"
(
    "id"         VARCHAR(36) PRIMARY KEY,
    "userId"     VARCHAR(36) REFERENCES "Users" ("id"),
    "totalPrice" NUMERIC(10, 2) NOT NULL CHECK ("totalPrice" >= 0),
    "createdAt"  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "status"     VARCHAR(50)              DEFAULT 'New'
);

CREATE TABLE "OrdersItems"
(
    "orderId"   VARCHAR(36)    NOT NULL REFERENCES "Orders" ("id") ON DELETE CASCADE,
    "productId" VARCHAR(36)    NOT NULL REFERENCES "Products" ("id"),
    "quantity"  INTEGER        NOT NULL CHECK ("quantity" > 0),
    "price"     NUMERIC(10, 2) NOT NULL,

    PRIMARY KEY ("orderId", "productId")
);

CREATE TABLE "UsersWishProducts"
(
    "userId"    VARCHAR(36) NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
    "productId" VARCHAR(36) NOT NULL REFERENCES "Products" ("id") ON DELETE CASCADE,

    PRIMARY KEY ("userId", "productId")
);