import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FarmerService } from './services/farmer.service';
import { FarmerController } from './controllers/farmer.controller';
import { PrismaService } from './prisma.service';
import { FarmerRepository } from './infra/db/farmRepository';
import { ValidateDuplicateDocument } from './model/validateDuplicatedDocument';

@Module({
  imports: [],
  controllers: [AppController, FarmerController],
  providers: [
    AppService,
    FarmerService,
    PrismaService,
    FarmerRepository,
    ValidateDuplicateDocument,
  ],
})
export class AppModule {}
