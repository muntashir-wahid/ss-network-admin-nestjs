import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { InventoryChangeType } from 'src/generated/prisma/enums';

export class PatchInventoryLogDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  assetName?: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @IsEnum(InventoryChangeType)
  changeType: InventoryChangeType;

  @IsInt()
  @Min(0)
  updatedStock: number;

  @IsInt()
  @Min(0)
  previousStock: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  updatedPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  previousPrice: number;

  @IsString()
  @MaxLength(500)
  note: string;
}
