import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.services';

@Injectable()
export class AuthService {
  constructor (
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise <any> {
    const user = await this.userService.findOneUser(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const {password, ...result} = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {username: user.username, sub: user.userId};

    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
