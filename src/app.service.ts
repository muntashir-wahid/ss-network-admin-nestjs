import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'success',
      message: 'SS Network Admin API is running!',
    };
  }
}
