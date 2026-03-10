import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  office_location: z.string().optional().nullable(),
  working_hours: z.string().regex(/^\d+\s+hours?$/, 'Working hours must be in format "X hours"').optional().nullable(),
  avatar: z.string().url('Invalid URL for avatar').optional().nullable(),
});

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;