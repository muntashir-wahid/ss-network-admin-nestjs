import { Injectable } from '@nestjs/common';
import { PatchInventoryLogDto } from '../dtos/patch-inventory-item.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UpdateInventoryItemProvider {
  constructor(private readonly prismaService: PrismaService) {}

  public execute(
    uid: string,
    adminUid: string,
    patchInventoryDto: PatchInventoryLogDto,
  ) {
    const result = this.prismaService.$transaction(
      async (transactionClient) => {
        if (patchInventoryDto.changeType === 'DISPATCH') {
          await transactionClient.inventory.update({
            where: { uid },
            data: {
              stock: patchInventoryDto.updatedStock,
            },
          });
        } else {
          await transactionClient.inventory.update({
            where: { uid },
            data: {
              ...(patchInventoryDto.updatedPrice !==
              patchInventoryDto.previousPrice
                ? { price: patchInventoryDto.updatedPrice }
                : {}),
              ...(patchInventoryDto.updatedStock !==
              patchInventoryDto.previousStock
                ? {
                    stock: patchInventoryDto.updatedStock,
                    totalPurchased: {
                      increment:
                        patchInventoryDto.updatedStock -
                        patchInventoryDto.previousStock,
                    },
                  }
                : {}),
              ...(patchInventoryDto.assetName
                ? { assetName: patchInventoryDto.assetName }
                : {}),
            },
          });
        }

        const updateLog = await transactionClient.inventoryLog.create({
          data: {
            inventoryUid: uid,
            adminUid: adminUid,
            changeType: patchInventoryDto.changeType,
            updatedPrice: patchInventoryDto.updatedPrice,
            previousPrice: patchInventoryDto.previousPrice,
            updatedStock: patchInventoryDto.updatedStock,
            previousStock: patchInventoryDto.previousStock,
            note: patchInventoryDto.note,
          },
        });

        return updateLog;
      },
    );

    return result;
  }
}
