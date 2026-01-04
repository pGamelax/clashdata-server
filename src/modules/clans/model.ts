import { describe, z } from "zod";

export namespace ClanModel {
  export const clan = z.object({
    id: z.string(),
    name: z.string(),
    tag: z.string(),
    userId: z.string(),
    createdAt: z.coerce.string(),
    updatedAt: z.coerce.string(),
  });

  export type Clan = z.infer<typeof clan>;

  export const createBody = z.object({
    clanTag: z.string().startsWith("#", "Clan tag must be start with #"),
    userEmail: z.email("Invalid email"),
  });

  export type CreateBody = z.infer<typeof createBody>;

  export const createResponse = z.object({
    id: z.string(),
    name: z.string(),
    tag: z.string(),
    userId: z.string(),
    createdAt: z.coerce.string(),
    updatedAt: z.coerce.string(),
  });

  export type CreateResponse = z.infer<typeof createResponse>;

  export const createInvalid = z.literal("Invalid clan tag or owner email");
  export type CreateInvalid = z.infer<typeof createInvalid>;

  export const startQueueBody = z.object({
    clanTag: z.string().startsWith("#", "Clan tag must be start with #"),
  });

  export type StartQueueBody = z.infer<typeof startQueueBody>;

  export const startQueueResponse = z.object({
    message: z.string(),
  });

  export type StartQueueResponse = z.infer<typeof startQueueResponse>;

  export const startQueueInvalid = z.literal("Invalid clan tag");
  export type StartQueueInvalid = z.infer<typeof startQueueInvalid>;

  export const clanInfoParams = z.object({
    clanTag: z.string().startsWith("#", "Clan tag must be start with #"),
  });

  export const clanInfoResponse = z.object({
    name: z.string(),
    tag: z.string(),
    description: z.string(),
    badgeUrls: z.object({
      small: z.string(),
      medium: z.string(),
      large: z.string(),
    }),
    totalWars: z.number(),
    warWins: z.number(),
    warTies: z.number(),
    warLosses: z.number(),
  });

  export type ClanInfoResponse = z.infer<typeof clanInfoResponse>;

  export const clanInfoInvalid = z.literal("Invalid clan tag");
  export type ClanInfoInvalid = z.infer<typeof clanInfoInvalid>;
}
