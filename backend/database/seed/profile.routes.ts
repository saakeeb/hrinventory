import { Router } from 'express';
import { authMiddleware } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validation.middleware';
import { updateProfileSchema } from './profile.dto';
import { getProfileController, updateProfileController, getAuditLogsController } from './profile.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getProfileController);
router.put('/', validate(updateProfileSchema), updateProfileController);
router.get('/audit-logs', getAuditLogsController);

export default router;