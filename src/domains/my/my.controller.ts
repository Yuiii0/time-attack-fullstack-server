import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { DUser } from 'src/decorators/user.decorator';
import { MyService } from './my.service';

@Controller('my')
export class MyController {
  constructor(private readonly myService: MyService) {}

  @Get('/deals')
  getMyPost(@DUser() user: User) {
    return this.myService.getMyPost(user);
  }
}
