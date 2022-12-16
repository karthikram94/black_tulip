import { Module } from '@nestjs/common';
import { UserModuleController } from './user-module.controller';
import { UserModuleService } from './user-module.service';

@Module({
  controllers: [UserModuleController],
  providers: [UserModuleService]
})
export class UserModuleModule {}
