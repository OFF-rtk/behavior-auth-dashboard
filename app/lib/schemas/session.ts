import { z } from 'zod';
import { SnapshotSchema } from './snapshot';

export const SessionSchema = z.object({
  filename: z.string(),
  snapshots: z.array(SnapshotSchema),
});

export type Session = z.infer<typeof SessionSchema>;
