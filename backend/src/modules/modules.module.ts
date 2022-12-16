import { Module } from '@nestjs/common';
import {UserModuleModule} from './user-module/user-module.module';

@Module({
  imports: [
    UserModuleModule
  ],
})
export class ModulesModule {}
