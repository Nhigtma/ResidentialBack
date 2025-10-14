import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/middleware/Jwt.strategy';
import { Questions, QuestionSchema } from 'src/schemas/question.schema';
import { AssemblyService } from 'src/services/assembly.service';
import { QuestionController } from '../controllers/question.controller';
import { QuestionService } from '../services/question.service';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';

@Module({
  imports: [
            MongooseModule.forFeature([{name:Questions.name ,schema: QuestionSchema}]),
                      AuthModule,
                      UserModule,
                      JwtModule
        ],
  providers: [QuestionService, AssemblyService, JwtStrategy, JwtService],
  controllers: [QuestionController],
  exports: [MongooseModule, QuestionService]
})
export class QuestionModule {}
