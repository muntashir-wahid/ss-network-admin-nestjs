-- CreateTable
CREATE TABLE "Zone" (
    "uid" TEXT NOT NULL,
    "zoneName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Area" (
    "uid" TEXT NOT NULL,
    "areaName" TEXT NOT NULL,
    "zoneUid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Zone_zoneName_key" ON "Zone"("zoneName");

-- CreateIndex
CREATE UNIQUE INDEX "Area_areaName_key" ON "Area"("areaName");

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_zoneUid_fkey" FOREIGN KEY ("zoneUid") REFERENCES "Zone"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
