/*
  Warnings:

  - You are about to drop the column `autoMatchPreferences` on the `Hunter` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hunter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "class" TEXT NOT NULL,
    "rank" TEXT NOT NULL DEFAULT 'D',
    "rankScore" REAL NOT NULL DEFAULT 0,
    "autoMatch" BOOLEAN NOT NULL DEFAULT false,
    "currentLat" REAL,
    "currentLng" REAL,
    CONSTRAINT "Hunter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Hunter" ("age", "autoMatch", "class", "currentLat", "currentLng", "gender", "id", "rank", "rankScore", "userId") SELECT "age", "autoMatch", "class", "currentLat", "currentLng", "gender", "id", "rank", "rankScore", "userId" FROM "Hunter";
DROP TABLE "Hunter";
ALTER TABLE "new_Hunter" RENAME TO "Hunter";
CREATE UNIQUE INDEX "Hunter_userId_key" ON "Hunter"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
