import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { IS_PUBLIC_KEY } from './auth.decorator';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException({ error: 'Session expired. Please log in again.' });
    }

    let payload: { id: number; name: string; email: string; roleId: number };
    try {
      payload = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret });
    } catch {
      throw new UnauthorizedException({ error: 'Session expired. Please log in again.' });
    }

    const user = await this.usersService.getUserById(payload.id);
    request.user = { id: user.id, name: user.name, email: user.email, roleId: user.roleId };
    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer') return token;
    }
    return request.cookies?.access_token;
  }
}
