-- DropForeignKey
ALTER TABLE "InventoryLog" DROP CONSTRAINT "InventoryLog_inventoryUid_fkey";

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "totalPurchased" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_inventoryUid_fkey" FOREIGN KEY ("inventoryUid") REFERENCES "Inventory"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
