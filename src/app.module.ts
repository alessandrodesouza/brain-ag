import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FarmerService } from './services/farmer.service';
import { FarmerController } from './controllers/farmer.controller';
import { PrismaService } from './prisma.service';
import { FarmerRepository } from './infra/db/farmerRepository';
import { ValidateDuplicateDocument } from './model/validateDuplicatedDocument';
import { FarmService } from './services/farm.service';
import { FarmRepository } from './infra/db/farmRepository';
import { FarmController } from './controllers/farm.controller';

@Module({
  imports: [],
  controllers: [AppController, FarmerController, FarmController],
  providers: [
    AppService,
    PrismaService,
    FarmService,
    FarmerService,
    FarmRepository,
    FarmerRepository,
    ValidateDuplicateDocument,
  ],
})
export class AppModule {}
