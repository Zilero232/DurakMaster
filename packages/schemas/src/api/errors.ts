import { z } from 'zod';

export const apiErrorCodeSchema = z.enum([
  'BAD_REQUEST',
  'CONFLICT',
  'FORBIDDEN',
  'INTERNAL_ERROR',
  'NOT_FOUND',
  'PAYLOAD_TOO_LARGE',
  'UNAUTHORIZED',
  'UNSUPPORTED_MEDIA_TYPE'
]);

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;

export const apiErrorSchema = z.object({
  code: apiErrorCodeSchema,
  error: z.string()
});

export type ApiError = z.infer<typeof apiErrorSchema>;
