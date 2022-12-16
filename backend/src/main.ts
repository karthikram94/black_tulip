import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import sequelize from './database/connection';
import Users from './models/users.model';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '2000mb' }));
  app.use(bodyParser.urlencoded({ limit: '2000mb', extended: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // removes the extra property which are coming
      transform: true, // to get plain javascript object
    }),
  );
  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };
  app.enableCors(options);
  
  sequelize.sync().then(() => {
    Users.sync({alter:true})
  });

  await app.listen(4000);
  process.stdout.write(
    `app is running in  mode - port 4000 \n`,
  );
}
bootstrap();
