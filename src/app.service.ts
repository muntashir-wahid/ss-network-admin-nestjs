import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  getHello() {
    return {
      status: 'success',
      message: 'SS Network Admin API is running!',
    };
  }
}
