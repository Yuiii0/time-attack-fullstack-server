import { Module } from '@nestjs/common';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { LikesModule } from './likes/likes.module';

@Module({
  controllers: [DealsController],
  providers: [DealsService],
  imports: [LikesModule],
})
export class DealsModule {}
