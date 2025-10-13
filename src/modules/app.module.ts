import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ArModule } from './ar.module';
import { AssemblyModule } from './assembly.module';
import { AuthModule } from './auth.module';
import { HouseModule } from './house.module';
import { QuestionModule } from './question.module';
import { VoteModule } from './vote.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dbName: 'residential',
        uri: configService.get<string>('MONGO_URL'),
        tls: true,
        tlsAllowInvalidCertificates: true,
      }),
      inject: [ConfigService],
    }),
    ArModule,
    AuthModule,
    AssemblyModule,
    HouseModule,
    QuestionModule,
    VoteModule
  ],
})
export class AppModule {}
