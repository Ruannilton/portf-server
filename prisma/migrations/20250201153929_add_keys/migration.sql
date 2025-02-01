/*
  Warnings:

  - Added the required column `keys` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "brief" TEXT NOT NULL,
    "description" TEXT,
    "repository_link" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "userId" TEXT NOT NULL,
    "keys" JSONB NOT NULL,
    CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("brief", "description", "endDate", "id", "name", "repository_link", "startDate", "userId") SELECT "brief", "description", "endDate", "id", "name", "repository_link", "startDate", "userId" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
