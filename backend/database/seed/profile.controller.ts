import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { getProfileService, updateProfileService, getAuditLogsService } from './profile.service';
import { UpdateProfileDTO } from './profile.dto';

export async function getProfileController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const profile = await getProfileService(req.user.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

export async function updateProfileController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const updatedProfile = await updateProfileService(req.user.id, req.user.role, req.body as UpdateProfileDTO);
    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
}

export async function getAuditLogsController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const logs = await getAuditLogsService(req.user.id);
        res.json(logs);
    } catch (error) {
        next(error);
    }
}