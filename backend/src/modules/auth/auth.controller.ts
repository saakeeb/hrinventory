import { Request, Response } from 'express';
import { loginService, registerService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.dto';

export async function loginController(req: Request, res: Response) {
  try {
    const loginData: LoginDTO = req.body;
    const result = await loginService(loginData);
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      sameSite: 'lax',
    });
    res.status(200).json({ user: result.user });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function registerController(req: Request, res: Response) {
  try {
    const registerData: RegisterDTO = req.body;
    const result = await registerService(registerData);
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      sameSite: 'lax',
    });
    res.status(201).json({ user: result.user });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function logoutController(req: Request, res: Response) {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
}