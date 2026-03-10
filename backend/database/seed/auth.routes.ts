import { Router } from 'express';
import { loginController } from './auth.controller';
import { validate } from '@/middleware/validation.middleware';
import { loginSchema } from './auth.dto';

const router = Router();

router.post('/login', validate(loginSchema), loginController);

export default router;