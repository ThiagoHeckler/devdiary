import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let env: Record<string, string | undefined>;

  beforeAll(async () => {
    env = {
      ADMIN_EMAIL: 'Eu@Exemplo.com',
      ADMIN_PASSWORD_HASH: await bcrypt.hash('senha-correta-123', 4),
    };
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: new JwtService({ secret: 'x'.repeat(32) }),
        },
        {
          provide: ConfigService,
          useValue: { get: (key: string) => env[key] },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    jwtService = module.get(JwtService);
  });

  it('returns a token for the right credentials', async () => {
    const { accessToken } = await service.login({
      email: 'eu@exemplo.com',
      password: 'senha-correta-123',
    });

    await expect(jwtService.verifyAsync(accessToken)).resolves.toMatchObject({
      sub: 'eu@exemplo.com',
    });
  });

  it('rejects a wrong password', async () => {
    await expect(
      service.login({ email: 'eu@exemplo.com', password: 'errada' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects an unknown e-mail', async () => {
    await expect(
      service.login({
        email: 'outro@exemplo.com',
        password: 'senha-correta-123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects everything when the admin is not configured', async () => {
    const saved = env.ADMIN_PASSWORD_HASH;
    env.ADMIN_PASSWORD_HASH = undefined;
    try {
      await expect(
        service.login({
          email: 'eu@exemplo.com',
          password: 'senha-correta-123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    } finally {
      env.ADMIN_PASSWORD_HASH = saved;
    }
  });
});
