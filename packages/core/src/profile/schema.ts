import { z } from 'zod';

export const privacyLevelSchema = z.enum(['public', 'connections', 'private']);
export const connectionStatusSchema = z.enum(['pending', 'accepted', 'rejected']);

export const profileUpdateSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').optional(),
  bio: z.string().optional(),
  contact_email_privacy: privacyLevelSchema.optional(),
  social_links: z.record(z.string()).optional(),
  social_links_privacy: privacyLevelSchema.optional(),
});

export const tagCreateSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
  category_id: z.string().uuid('Invalid category ID'),
});

export const connectionCreateSchema = z.object({
  recipient_id: z.string().uuid('Invalid recipient ID'),
});

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type TagCreate = z.infer<typeof tagCreateSchema>;
export type ConnectionCreate = z.infer<typeof connectionCreateSchema>;
