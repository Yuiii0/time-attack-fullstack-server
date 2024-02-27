import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './db/prisma/prisma.module';
import { PrismaService } from './db/prisma/prisma.service';
import { DomainsModule } from './domains/domains.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DomainsModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
