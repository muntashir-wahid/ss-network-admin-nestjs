import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Status } from 'src/generated/prisma/enums';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(15)
  contact: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  clientName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  addressLine: string;

  @IsDateString()
  @IsNotEmpty()
  connectionDate: string;

  @IsOptional()
  @IsEnum(Status, { message: 'Status must be either ACTIVE or DISABLED' })
  status?: Status;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  package: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  packagePrice: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  mpbsProvided?: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  zoneId: string;
}
