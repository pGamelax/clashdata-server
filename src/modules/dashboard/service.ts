import { eq } from "drizzle-orm";
import { db } from "@/database/client";
import { clans } from "@/database/schema/clans";
import { DashboardRepository } from "./repository";
import { Unauthorized } from "@/errors/Errors";

const repo = new DashboardRepository();

export class DashboardService {
  async getDashboard(params: {
    clanTag: string;
    userId: string;
    page: number;
    limit: number;
  }) {
    const { clanTag, userId, page, limit } = params;

    const clan = await db.query.clans.findFirst({
      where: eq(clans.tag, clanTag),
    });

    if (!clan) {
      throw new Error("User not have a clan");
    }

    if (clan.userId !== userId) {
      throw new Unauthorized("User not have access to this clan");
    }

    const groupedStats = await repo.getPlayersStatsByClan(clan.id);

    const ranked = groupedStats
      .map((stat) => {
        const totalAttacks = Number(stat.countId);
        const totalStars = Number(stat.sumStars ?? 0);
        const totalDestruction = Number(stat.sumDestruction ?? 0);

        return {
          playerId: stat.playerId,
          totalAttacks,
          totalStars,
          totalDestruction,
          avgStars: totalStars / totalAttacks,
          avgDestruction: totalDestruction / totalAttacks,
        };
      })
      .sort((a, b) => b.avgStars - a.avgStars);

    const paginatedPlayers = ranked.slice((page - 1) * limit, page * limit);

    const playersData = await Promise.all(
      paginatedPlayers.map(async (p) => {
        const info = await repo.getPlayerInfo(p.playerId);
        const attacksData = await repo.getPlayerAttacks({
          playerId: p.playerId,
          clanId: clan.id,
        });

        return {
          ...info,
          stats: {
            totalAttacks: p.totalAttacks,
            totalStars: p.totalStars,
            avgStars: Number(p.avgStars.toFixed(2)),
            avgDestruction: Number(p.avgDestruction.toFixed(2)),
          },
          attacks: attacksData,
        };
      }),
    );

    return {
      players: playersData,
      pagination: {
        page,
        totalPlayers: await repo.countPlayersByClan(clan.id),
      },
    };
  }

  async getDashboardFromAPI(params: { clanTag: string; userId: string }) {
    const { clanTag, userId } = params;

    const clan = await db.query.clans.findFirst({
      where: eq(clans.tag, clanTag),
    });

    if (!clan) throw new Error("Clan not registered in database");
    if (clan.userId !== userId) throw new Unauthorized("No access");

    const response = await fetch(
      `https://api.clashk.ing/war/${encodeURIComponent(clanTag)}/previous?limit=50`,
    );
    const apiData = await response.json();
    const playerMap = new Map<string, any>();

    apiData.items.forEach((war: any) => {
      const isNormalOrder = war.clan.tag === clanTag;
      const ourClan = isNormalOrder ? war.clan : war.opponent;
      const enemyClan = isNormalOrder ? war.opponent : war.clan;

      if (!war.tag) {
        ourClan.members.forEach((member: any) => {
          if (!playerMap.has(member.tag)) {
            playerMap.set(member.tag, {
              tag: member.tag,
              name: member.name,
              townhallLevel: member.townhallLevel,
              allAttacks: [],
              allDefenses: [],
            });
          }

          const p = playerMap.get(member.tag);

          if (member.attacks) {
            member.attacks.forEach((att: any) => {
              p.allAttacks.push({
                date: war.endTime,
                stars: att.stars,
                destruction: att.destructionPercentage,
                opponent: enemyClan.name,
              });
            });
          }

          if (member.bestOpponentAttack) {
            p.allDefenses.push({
              date: war.endTime,
              stars: member.bestOpponentAttack.stars,
              destruction: member.bestOpponentAttack.destructionPercentage,
            });
          }
        });
      }
    });
    return { players: Array.from(playerMap.values()) };
  }
}
