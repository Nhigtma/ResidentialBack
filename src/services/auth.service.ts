import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dtos/login.dto';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor (
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateToken(id: string) {
    return await this.userService.findOneUser(id);
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneUser(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const {password, ...result} = user;
      return result;
    } else {
      return null
    }
  }

  async login(loginDto: LoginDto) {
    if (!loginDto || !loginDto.username || !loginDto.password) {
      throw new BadRequestException("Missing credential")
    }
    const user = await this.validateUser(loginDto.username, loginDto.password)
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }
    const payload ={id: user._id, permissionLevel: user.rol};
    console.log(user.rol)
    return {
      access_token: this.jwtService.sign(payload),
      rol: user.rol
    };
  }
}
