-- CreateTable
CREATE TABLE "CourseInstance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campus" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "term" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instructionType" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "enrollmentMax" INTEGER NOT NULL
);
