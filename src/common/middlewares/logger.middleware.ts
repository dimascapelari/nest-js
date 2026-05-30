import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log('[Middleware] Passando...........................');

    const authorization = req.headers.authorization;

    if (authorization) {
      (req as any).user = {
        token: authorization,
        role: 'admin',
      };
    }

    next();
  }
}
