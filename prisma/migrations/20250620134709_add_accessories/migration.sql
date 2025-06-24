-- AlterTable
ALTER TABLE "devices" ADD COLUMN "description" TEXT;
ALTER TABLE "devices" ADD COLUMN "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "parts" ADD COLUMN "description" TEXT;
ALTER TABLE "parts" ADD COLUMN "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "accessories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT,
    "price" REAL NOT NULL,
    "inStock" INTEGER NOT NULL,
    "minStock" INTEGER NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "compatibility" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
