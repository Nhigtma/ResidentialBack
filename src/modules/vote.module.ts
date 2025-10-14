import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/middleware/Jwt.strategy';
import { Votes, VoteSchema } from 'src/schemas/vote.schema';
import { ArService } from 'src/services/ar.service';
import { QuestionService } from 'src/services/question.service';
import { UserService } from 'src/services/user.service';
import { VoteController } from '../controllers/vote.controller';
import { VoteService } from '../services/vote.service';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';

@Module({
  imports : [
      MongooseModule.forFeature([{name:Votes.name ,schema: VoteSchema}]),
                AuthModule,
                UserModule,
                JwtModule
    ],
  providers: [VoteService, QuestionService, UserService, ArService, JwtStrategy, JwtService],
  controllers: [VoteController],
  exports: [MongooseModule, VoteService]
})
export class VoteModule {}
