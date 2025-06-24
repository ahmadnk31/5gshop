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
    "estimatedTime" TEXT,
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
