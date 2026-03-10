import { Router } from 'express';
import { authMiddleware } from '@/middleware/auth.middleware';
import {
  getProfileController,
  updateProfileController,
  getAuditLogsController,
} from './profile.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getProfileController);
router.put('/', updateProfileController);
router.get('/audit-logs', getAuditLogsController);

export default router;
