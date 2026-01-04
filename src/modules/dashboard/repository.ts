import { db } from "@/database/client";
import { attacks } from "@/database/schema/attacks";
import { players } from "@/database/schema/players";
import { wars } from "@/database/schema/wars";
import { eq, sum, count, desc, and, inArray } from "drizzle-orm";

export class DashboardRepository {
  async getPlayersStatsByClan(clanId: string) {
    return await db
      .select({
        playerId: attacks.playerId,
        countId: count(attacks.id),
        sumStars: sum(attacks.stars),
        sumDestruction: sum(attacks.destruction),
      })
      .from(attacks)
      .innerJoin(wars, eq(attacks.warId, wars.id))
      .where(eq(wars.clanId, clanId))
      .groupBy(attacks.playerId);
  }

  async getPlayerInfo(playerId: string) {
    return await db.query.players.findFirst({
      where: eq(players.id, playerId),
      columns: {
        id: true,
        name: true,
        tag: true,
      },
    });
  }

  async getPlayerAttacks(params: { playerId: string; clanId: string }) {
    return await db
      .select({
        id: attacks.id,
        stars: attacks.stars,
        destruction: attacks.destruction,
        createdAt: attacks.createdAt,
        war: {
          id: wars.id,
          startDate: wars.startDate,
          endDate: wars.endDate,
        },
      })
      .from(attacks)
      .innerJoin(wars, eq(attacks.warId, wars.id))
      .where(
        and(
          eq(attacks.playerId, params.playerId),
          eq(wars.clanId, params.clanId),
        ),
      )
      .orderBy(desc(attacks.createdAt));
  }

  async countPlayersByClan(clanId: string) {
    const result = await db
      .select({ playerId: attacks.playerId })
      .from(attacks)
      .innerJoin(wars, eq(attacks.warId, wars.id))
      .where(eq(wars.clanId, clanId))
      .groupBy(attacks.playerId);

    return result.length;
  }
}
