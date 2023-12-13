import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

type ExtendedRequest = Request & { user: object };
@Injectable()
export class CheckAuthentication implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: ExtendedRequest, res: Response, next: NextFunction) {
    if (!req.headers['authorization']) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    let token = req.headers['authorization'].split(' ')[1] || '';
    try {
      const decodedToken = this.jwtService.decode(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
