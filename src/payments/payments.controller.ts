import { Body, Controller, Get, Post } from '@nestjs/common';

import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { PaymentsService } from './providers/payments.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';

@Roles(Role.SUPER_ADMIN, Role.ADMIN)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  processPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.processPayment(createPaymentDto);
  }

  @Get()
  getAllPayments() {
    return this.paymentsService.findAll();
  }
}
