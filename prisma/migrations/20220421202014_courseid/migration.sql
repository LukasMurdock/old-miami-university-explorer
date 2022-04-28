/*
  Warnings:

  - You are about to drop the column `courseId` on the `CourseInstance` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourseInstance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campus" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "term" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instructionType" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "enrollmentMax" INTEGER NOT NULL
);
INSERT INTO "new_CourseInstance" ("campus", "code", "credits", "description", "enrollmentMax", "id", "instructionType", "section", "subject", "term") SELECT "campus", "code", "credits", "description", "enrollmentMax", "id", "instructionType", "section", "subject", "term" FROM "CourseInstance";
DROP TABLE "CourseInstance";
ALTER TABLE "new_CourseInstance" RENAME TO "CourseInstance";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
