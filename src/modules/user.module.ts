import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from "src/controllers/user.controller";
import { JwtStrategy } from "src/middleware/Jwt.strategy";
import { Users, UserSchema } from "src/schemas/user.schema";
import { AuthService } from "src/services/auth.service";
import { UserService } from "src/services/user.service";


@Module({
    imports: [
        MongooseModule.forFeature([{name:Users.name ,schema: UserSchema}]),
        JwtModule
    ],
    exports: [MongooseModule, UserService],
    controllers: [UserController],
    providers: [UserService, JwtStrategy, JwtService, AuthService]
})
export class UserModule{}