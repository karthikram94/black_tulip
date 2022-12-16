import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ModulesModule} from './modules/modules.module';
import { ConfigModule } from 'nestjs-dotenv';
const bcrypt = require('bcrypt');
import Users from './models/users.model';

@Module({
  imports: [ModulesModule,ConfigModule.forRoot(),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(){
      Users.findOne({
        where:{
          USERROLEId:1
        }
      }).then(async(findAdminExists:any) => {        
        if(!findAdminExists){
          const data = {EMAIL:'admin@gmail.com',PASSWORD:await bcrypt.hash('Admin@123',10),USERROLEId:1}
          const builddata = await Users.build(data);
          await builddata.save();
        }
      } )
  }
}
