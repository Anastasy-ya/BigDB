import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const { USER, HOST, PASSWORD, DATABASE } = process.env;

if (!USER || !PASSWORD || !HOST || !DATABASE) {
  throw new Error('One or more environment variables are missing');
}

const DATABASE_URL = `postgresql://${USER}:${PASSWORD}@${HOST}/${DATABASE}?sslmode=require`;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: DATABASE_URL,
      entities: [User],
      synchronize: false, // Не использовать в продакшене
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    UsersModule,
  ],
})
export class AppModule {}
