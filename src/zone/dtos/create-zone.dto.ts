import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateZoneDto {
  @IsNotEmpty()
  @IsString()
  zoneName: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  areaNames: string[];
}
