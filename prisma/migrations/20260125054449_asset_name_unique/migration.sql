/*
  Warnings:

  - A unique constraint covering the columns `[assetName]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Inventory_assetName_key" ON "Inventory"("assetName");
