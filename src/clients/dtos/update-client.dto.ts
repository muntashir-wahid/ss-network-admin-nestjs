import { PartialType } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';

class UpdateClientDto extends PartialType(CreateClientDto) {}

export default UpdateClientDto;
