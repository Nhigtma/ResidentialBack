import { Module } from '@nestjs/common';
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
              UserModule
  ],
  providers: [HouseService, UserService, JwtStrategy],
  exports: [MongooseModule, HouseService],
  controllers: [HouseController]
})
export class HouseModule {}
