-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "units" TEXT NOT NULL DEFAULT 'metric',
    "updatePeriod" INTEGER NOT NULL DEFAULT 1,
    "widgets" TEXT NOT NULL DEFAULT '{"wind":true,"humidity":true,"feelsLike":true,"visibility":true,"pressure":true,"uvIndex":true,"precipitation":true,"aqi":true}',
    "activities" TEXT NOT NULL DEFAULT '{"running":true,"jogging":true,"cycling":true,"hiking":true}',
    "savedLocations" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_sessionId_key" ON "UserSettings"("sessionId");
