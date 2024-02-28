import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DealsModule } from './deals/deals.module';
import { MyModule } from './my/my.module';

@Module({
  imports: [AuthModule, DealsModule, MyModule],
})
export class DomainsModule {}
