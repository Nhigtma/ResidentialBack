import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/middleware/Jwt.strategy';
import { Houses, HouseSchema } from 'src/schemas/house.schema';
import { UserService } from 'src/services/user.service';
import { HouseController } from '../controllers/house.controller';
import { HouseService } from '../services/house.service';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';

@Module({
  imports : [
    MongooseModule.forFeature([{name:Houses.name ,schema: HouseSchema}]),
              AuthModule,
              UserModule,
              JwtModule
  ],
  providers: [HouseService, UserService, JwtStrategy, JwtService],
  exports: [MongooseModule, HouseService],
  controllers: [HouseController]
})
export class HouseModule {}
