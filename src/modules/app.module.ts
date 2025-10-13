import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth.module';

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

    AuthModule
  ],
})
export class AppModule {}
