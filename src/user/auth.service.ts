import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { UserService } from './user.service';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signin(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('bad password');
    }
    const payload = { id: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
      }),
    };
  }
  async refreshToken(payload: any) {
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
