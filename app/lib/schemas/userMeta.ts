import { z } from 'zod'

export const UserMetaSchema = z.object({
  user_id: z.string(),
  trained: z.boolean(),
  latest_risk: z.number().nullable(),
  last_trained: z.coerce.date(),
  snapshot_count: z.number(),
  model_version: z.number(),
});

export type UserMeta = z.infer<typeof UserMetaSchema>;
export const UserMetaArraySchema = z.array(UserMetaSchema)