import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth.middleware';
import * as profileService from './profile.service';

export async function getProfileController(req: AuthRequest, res: Response) {
  try {
    const profile = await profileService.getProfileService(req.user!.id);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function updateProfileController(req: AuthRequest, res: Response) {
  try {
    const updatedProfile = await profileService.updateProfileService(req.user!.id, req.body);
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function getAuditLogsController(req: AuthRequest, res: Response) {
  try {
    const logs = await profileService.getAuditLogsService(req.user!.id);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
