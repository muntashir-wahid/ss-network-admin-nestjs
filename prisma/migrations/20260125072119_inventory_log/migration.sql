-- CreateEnum
CREATE TYPE "InventoryChangeType" AS ENUM ('DISPATCH', 'UPDATE', 'STOCK_UPDATE', 'PRICE_CHANGE');

-- CreateTable
CREATE TABLE "InventoryLog" (
    "uid" TEXT NOT NULL,
    "inventoryUid" TEXT NOT NULL,
    "adminUid" TEXT NOT NULL,
    "changeType" "InventoryChangeType" NOT NULL,
    "updatedStock" INTEGER NOT NULL,
    "previousStock" INTEGER NOT NULL,
    "updatedPrice" DECIMAL(65,30) NOT NULL,
    "previousPrice" DECIMAL(65,30) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryLog_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE INDEX "InventoryLog_inventoryUid_idx" ON "InventoryLog"("inventoryUid");

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_inventoryUid_fkey" FOREIGN KEY ("inventoryUid") REFERENCES "Inventory"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_adminUid_fkey" FOREIGN KEY ("adminUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
