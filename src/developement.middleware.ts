import { Request, Response, NextFunction } from 'express';

export function latency(req: Request, res: Response, next: NextFunction) {
  // if(process.env.ENVIRONMENT === "dev") {
  setTimeout(() => {
    next();
    console.warn('This is being slowed down intentionally');
  }, 3000);
  // }
}
