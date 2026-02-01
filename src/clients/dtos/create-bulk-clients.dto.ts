import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateClientDto } from './create-client.dto';

export class CreateBulkClientsDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one client must be provided' })
  @ValidateNested({ each: true })
  @Type(() => CreateClientDto)
  clients: CreateClientDto[];
}
