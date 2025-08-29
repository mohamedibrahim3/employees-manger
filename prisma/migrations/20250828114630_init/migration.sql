-- DropIndex
DROP INDEX "relationships_nationalId_key";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_employees" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "nationalId" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "residenceLocation" TEXT NOT NULL,
    "hiringDate" DATETIME NOT NULL,
    "hiringType" TEXT NOT NULL,
    "email" TEXT,
    "administration" TEXT NOT NULL,
    "actualWork" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "personalImageUrl" TEXT,
    "idFrontImageUrl" TEXT,
    "idBackImageUrl" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_employees" ("actualWork", "administration", "birthDate", "createdAt", "email", "hiringDate", "hiringType", "id", "idBackImageUrl", "idFrontImageUrl", "maritalStatus", "name", "nationalId", "nickName", "notes", "personalImageUrl", "phoneNumber", "profession", "residenceLocation", "updatedAt") SELECT "actualWork", "administration", "birthDate", "createdAt", "email", "hiringDate", "hiringType", "id", "idBackImageUrl", "idFrontImageUrl", "maritalStatus", "name", "nationalId", "nickName", "notes", "personalImageUrl", "phoneNumber", "profession", "residenceLocation", "updatedAt" FROM "employees";
DROP TABLE "employees";
ALTER TABLE "new_employees" RENAME TO "employees";
CREATE UNIQUE INDEX "employees_nationalId_key" ON "employees"("nationalId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
