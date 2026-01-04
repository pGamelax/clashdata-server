import { db } from "@/database/client";
import { clans } from "@/database/schema/clans";
import { BadRequest } from "@/errors/Errors";
import { eq } from "drizzle-orm";

export class ClanRepository {
  async create({
    clanTag,
    name,
    userId,
  }: {
    clanTag: string;
    name: string;
    userId: string;
  }) {
    const [clanCreated] = await db
      .insert(clans)
      .values({
        tag: clanTag,
        name,
        userId,
      })
      .returning();

    return clanCreated;
  }
  async findByTag({ clanTag }: { clanTag: string }) {
    const [clan] = await db.select().from(clans).where(eq(clans.tag, clanTag));

    if (!clan) {
      throw new BadRequest("Clan not found");
    }

    return clan;
  }

  async findAll({ userId }: { userId: string }) {
    const clansFound = await db
      .select()
      .from(clans)
      .where(eq(clans.userId, userId));

    return clansFound;
  }
}
