import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(4, 'Password must contain at least 4 characters');
