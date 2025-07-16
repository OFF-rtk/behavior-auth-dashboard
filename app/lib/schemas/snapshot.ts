import { z } from 'zod';

export const SnapshotSchema = z.object({
  tap_duration: z.number(),
  inter_key_delay_avg: z.number(),
  key_press_duration_avg: z.number(),
  typing_error_rate: z.number(),
  swipe_speed: z.number(),
  swipe_angle: z.number(),
  scroll_distance: z.number(),
  scroll_velocity: z.number(),
  gyro_variance: z.number(),
  accelerometer_noise: z.number(),
  session_duration_sec: z.number(),
  session_start_hour: z.number(),
  screen_transition_count: z.number(),
  avg_dwell_time_per_screen: z.number(),

  risk: z.number().optional(),
  geo_shift_score: z.number().optional(),
  network_shift_score: z.number().optional(),
  device_mismatch_score: z.number().optional(),
});

export type Snapshot = z.infer<typeof SnapshotSchema>;
