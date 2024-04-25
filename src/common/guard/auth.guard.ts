import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorator/auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Exception
    try {
      // Check is public routes
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      // Check is public route
      if (isPublic) return true;

      // Request data
      const request = context.switchToHttp().getRequest();

      // Get token from request
      const token = this.extractTokenFromHeader(request);

      // Check token is valid
      if (!token) throw new UnauthorizedException();

      // Secret
      const secret: any = { secret: jwtConstants.secret };

      // Payload
      const payload = await this.jwtService.verifyAsync(token, secret);

      // Return Data
      request['user'] = payload;
    } catch {
      // Throw Error
      throw new UnauthorizedException();
    }

    // Return
    return true;
  }

  // Get token from header
  private extractTokenFromHeader(request: Request): string | undefined {
    // Get type and token from request headers
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    // Return
    return type === 'Bearer' ? token : undefined;
  }
}
