import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables.');
}

export const config = {
  port: parseInt(parsedEnv.data.PORT, 10),
  databaseUrl: parsedEnv.data.DATABASE_URL,
  jwtSecret: parsedEnv.data.JWT_SECRET,
  corsOrigin: parsedEnv.data.CORS_ORIGIN,
  nodeEnv: parsedEnv.data.NODE_ENV,
};