import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const { params, query, body } = req;

    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      this.logger.log(
        `${method} ${originalUrl} - Status: ${statusCode} - Time: ${duration}ms\n` +
          `Params: ${JSON.stringify(params)}\n` +
          `Query: ${JSON.stringify(query)}\n` +
          `Body: ${JSON.stringify(body)}`,
      );
    });

    next();
  }
}
