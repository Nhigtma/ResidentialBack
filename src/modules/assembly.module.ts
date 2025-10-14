import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/middleware/Jwt.strategy';
import { Assemblies, AssemblySchema } from 'src/schemas/assembly.schema';
import { AssemblyController } from '../controllers/assembly.controller';
import { AssemblyService } from '../services/assembly.service';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';

@Module({
  imports: [
          MongooseModule.forFeature([{name:Assemblies.name ,schema: AssemblySchema}]),
                    AuthModule,
                    UserModule,
                    JwtModule
      ],
  providers: [AssemblyService, JwtStrategy, JwtService],
  controllers: [AssemblyController],
  exports: [AssemblyService, MongooseModule]
})
export class AssemblyModule {}
