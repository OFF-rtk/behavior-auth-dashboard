import { z } from 'zod';
import { SessionSchema } from './session';

export const RiskLogSchema = z.object({
  timestamp: z.string(),
  risk: z.number(),
  geo_shift_score: z.number(),
  network_shift_score: z.number(),
  device_mismatch_score: z.number(),
});

export const UserSessionSchema = z.object({
  user_id: z.string(),
  risk_log: z.array(RiskLogSchema),
  sessions: z.array(SessionSchema),
});

export type UserSession = z.infer<typeof UserSessionSchema>;

export const APIErrorSchema = z.object({
  message: z.string(),
});

export const UserResponseSchema = z.union([
  UserSessionSchema,
  APIErrorSchema,
]);

export type APIError = z.infer<typeof APIErrorSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
