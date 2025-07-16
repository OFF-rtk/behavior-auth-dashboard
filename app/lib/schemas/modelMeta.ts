import { z } from 'zod'

export const ModelMetaSchema = z.object({
  user_id: z.string(),
  model_exists: z.boolean(),
  last_trained: z.coerce.date(),
  snapshot_count: z.number(),
  num_sessions: z.number(),
  num_quarantined_sessions: z.number(),
  model_type: z.string(),
  model_version: z.number(),
});

export type modelMeta = z.infer<typeof ModelMetaSchema>;