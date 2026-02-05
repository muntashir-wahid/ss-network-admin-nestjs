-- CreateTable
CREATE TABLE "Payment" (
    "uid" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "paymentYear" INTEGER NOT NULL,
    "paymentMonth" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE INDEX "Payment_clientId_paymentYear_idx" ON "Payment"("clientId", "paymentYear");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
