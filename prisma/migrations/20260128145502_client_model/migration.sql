-- CreateTable
CREATE TABLE "Client" (
    "uid" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "email" TEXT,
    "userId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "connectionDate" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "package" TEXT NOT NULL,
    "mpbsProvided" INTEGER,
    "zoneId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_contact_key" ON "Client"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
