import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateAreaDto {
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  areaName: string;
}
