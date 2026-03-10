import { Router } from 'express';
import { checkInController, checkOutController } from './attendance.controller';

const router = Router();

router.post('/check-in', checkInController);
router.post('/check-out', checkOutController);

export default router;