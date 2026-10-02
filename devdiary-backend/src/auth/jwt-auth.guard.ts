import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { AdminTokenPayload } from './auth.service';

/** Exige o cabeçalho `Authorization: Bearer <token>` com um token válido. */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }

    try {
      await this.jwtService.verifyAsync<AdminTokenPayload>(token);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
