/*
  Warnings:

  - You are about to alter the column `estimatedTime` on the `quotes` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_quotes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT,
    "deviceId" TEXT,
    "issues" TEXT NOT NULL,
    "description" TEXT,
    "estimatedCost" REAL,
    "estimatedTime" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "urgency" TEXT NOT NULL DEFAULT 'MEDIUM',
    "adminNotes" TEXT,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "quotes_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "quotes_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_quotes" ("adminNotes", "createdAt", "customerId", "description", "deviceId", "estimatedCost", "estimatedTime", "expiresAt", "id", "issues", "status", "updatedAt", "urgency") SELECT "adminNotes", "createdAt", "customerId", "description", "deviceId", "estimatedCost", "estimatedTime", "expiresAt", "id", "issues", "status", "updatedAt", "urgency" FROM "quotes";
DROP TABLE "quotes";
ALTER TABLE "new_quotes" RENAME TO "quotes";
CREATE TABLE "new_repairs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT,
    "deviceId" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "cost" REAL NOT NULL,
    "estimatedCompletion" DATETIME NOT NULL,
    "completedAt" DATETIME,
    "assignedTechnician" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "repairs_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "repairs_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_repairs" ("assignedTechnician", "completedAt", "cost", "createdAt", "customerId", "description", "deviceId", "estimatedCompletion", "id", "issue", "priority", "status", "updatedAt") SELECT "assignedTechnician", "completedAt", "cost", "createdAt", "customerId", "description", "deviceId", "estimatedCompletion", "id", "issue", "priority", "status", "updatedAt" FROM "repairs";
DROP TABLE "repairs";
ALTER TABLE "new_repairs" RENAME TO "repairs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
