import { z } from 'zod'

export const deviceProfileSchema = z.object({
    user_id: z.string(),
    device_profile: z.object({
        os: z.string(),
        os_version: z.string(),
        device_model: z.string()
    })
});

export type deviceProfile = z.infer<typeof deviceProfileSchema>;