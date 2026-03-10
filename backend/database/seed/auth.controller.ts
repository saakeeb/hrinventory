import { Request, Response, NextFunction } from 'express';
import { loginService } from './auth.service';
import { LoginBody } from './auth.dto';

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginService(req.body as LoginBody);
    res.json(result);
  } catch (error) {
    next(error);
  }
}