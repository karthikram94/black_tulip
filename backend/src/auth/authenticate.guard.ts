import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus
  } from '@nestjs/common';
  import * as jwt from 'jsonwebtoken';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const { authorization } = request.headers;
      if (!authorization) {
        throw new HttpException(
          { status: HttpStatus.FORBIDDEN, message: 'Access is forbidden' },
          HttpStatus.FORBIDDEN,
        );
      }
      request.user = await this.validateToken(authorization);
      return true;
    }
  
    async validateToken(auth: string) {
      const secret_Key = 'secretKey';
      if (auth.split(' ')[0] !== 'Bearer') {
        throw new HttpException(
          { status: HttpStatus.FORBIDDEN, message: 'Access is forbidden' },
          HttpStatus.FORBIDDEN,
        );
      }
      const token = auth.split(' ')[1];
      try {
        const decodedToken = await jwt.verify(token, secret_Key);
        return decodedToken;
      } catch (err) {
        throw new HttpException(
          { status: HttpStatus.UNAUTHORIZED, message: 'Invalid Token!' },
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }
  