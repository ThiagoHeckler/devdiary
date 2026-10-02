import {
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { LoginDto } from './dto/login.dto';

export interface AdminTokenPayload {
  sub: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  /**
   * Hash comparado quando o e-mail não confere, para que a resposta demore o
   * mesmo tempo nos dois casos e não revele se o e-mail existe.
   */
  private readonly dummyHash = bcrypt.hash(randomUUID(), 12);

  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    if (
      !this.config.get('ADMIN_EMAIL') ||
      !this.config.get('ADMIN_PASSWORD_HASH')
    ) {
      this.logger.warn(
        'ADMIN_EMAIL ou ADMIN_PASSWORD_HASH não definido: o login do admin está desativado.',
      );
    }
  }

  async login({ email, password }: LoginDto) {
    const adminEmail = this.config
      .get<string>('ADMIN_EMAIL')
      ?.trim()
      .toLowerCase();
    const adminHash = this.config.get<string>('ADMIN_PASSWORD_HASH');

    const emailMatches = !!adminEmail && email === adminEmail;
    const passwordMatches = await bcrypt.compare(
      password,
      emailMatches && adminHash ? adminHash : await this.dummyHash,
    );

    if (!emailMatches || !adminHash || !passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const payload: AdminTokenPayload = { sub: adminEmail };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
