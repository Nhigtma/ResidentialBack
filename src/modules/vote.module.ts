import { Module } from '@nestjs/common';
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
                UserModule
    ],
  providers: [VoteService, QuestionService, UserService, ArService, JwtStrategy],
  controllers: [VoteController],
  exports: [MongooseModule, VoteService]
})
export class VoteModule {}
