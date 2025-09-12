import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "src/controllers/auth.controller";
import { LocalStrategy } from "src/middleware/local.strategy";
import { AuthService } from "src/services/auth.service";
import { UserModule } from "./user.module";

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            imports : [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES')}
            }),
            inject: [ConfigService]
        })
    ],
    providers: [AuthService, LocalStrategy],
    controllers: [AuthController],
})
export class AuthModule {}