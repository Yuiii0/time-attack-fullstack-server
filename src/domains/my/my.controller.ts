import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { DUser } from 'src/decorators/user.decorator';
import { DealsService } from '../deals/deals.service';
import { MyService } from './my.service';

@Controller('my')
export class MyController {
  constructor(
    private readonly myService: MyService,
    private readonly dealsService: DealsService,
  ) {}

  @Get('/deals')
  getMyPost(@DUser() user: User) {
    return this.dealsService.getMyPost(user);
  }
}
