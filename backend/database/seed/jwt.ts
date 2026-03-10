import jwt from 'jsonwebtoken';
import { config } from '@/config';

export function verifyToken(token: string) {
  return jwt.verify(token, config.jwtSecret);
}