import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from "src/schemas/user.schema";
import { UserService } from "src/services/user.services";


@Module({
    imports: [
        MongooseModule.forFeature([{name:Users.name ,schema: UserSchema}])
    ],
    exports: [MongooseModule, UserService],
    providers: [UserService]
})
export class UserModule{}