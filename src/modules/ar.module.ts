import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/middleware/Jwt.strategy';
import { Assistance_registers, AssistanceRegisterSchema } from 'src/schemas/assistance_register.schema';
import { AssemblyService } from 'src/services/assembly.service';
import { UserService } from 'src/services/user.service';
import { ArController } from '../controllers/ar.controller';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';

@Module({
  imports: [
          MongooseModule.forFeature([{name:Assistance_registers.name ,schema: AssistanceRegisterSchema}]),
          AuthModule,
          UserModule,
          JwtModule
      ],
  providers: [AssemblyService, UserService, JwtStrategy, JwtService],
  controllers: [ArController],
  exports: [AssemblyService, MongooseModule],
})
export class ArModule {}
