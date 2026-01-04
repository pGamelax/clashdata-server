// save-war-stats.worker.ts
import { Worker } from "bullmq";
import { findWarQueue, redisConnection } from "../bullmq";
import axios from "axios";
import { db } from "@/database/client";

import { eq } from "drizzle-orm";
import { clans } from "@/database/schema/clans";
import { wars } from "@/database/schema/wars";
import { players } from "@/database/schema/players";
import { attacks } from "@/database/schema/attacks";

const TOKEN_COC = process.env.TOKEN_COC;

const formatCocDate = (cocDate: string) => {
  return cocDate.replace(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})\.(\d+)Z$/,
    "$1-$2-$3T$4:$5:$6.$7Z",
  );
};

new Worker(
  "save-war-stats-queue",
  async (job) => {
    const { clanTag } = job.data;
    console.log(`[saveWarStatsQueue] Salvando stats para: ${clanTag}`);

    try {
      const response = await axios.get(
        `https://api.clashofclans.com/v1/clans/${encodeURIComponent(
          clanTag,
        )}/currentwar`,
        { headers: { Authorization: `Bearer ${TOKEN_COC}` } },
      );

      const clan = await db.query.clans.findFirst({
        where: eq(clans.tag, clanTag),
      });

      if (!clan) {
        throw new Error(`Clan with tag ${clanTag} not found`);
      }

      const [war] = await db
        .insert(wars)
        .values({
          startDate: new Date(formatCocDate(response.data.startTime)),
          endDate: response.data.endTime
            ? new Date(formatCocDate(response.data.endTime))
            : null,
          clanId: clan.id,
        })
        .returning();

      for (const member of response.data.clan.members) {
        if (!member?.attacks?.length) continue;
        console.log(member);
        await db.transaction(async (tx) => {
          const [player] = await tx
            .insert(players)
            .values({
              tag: member.tag,
              name: member.name,
            })
            .onConflictDoUpdate({
              target: players.tag,
              set: { name: member.name },
            })
            .returning();

          const attacksToInsert = member.attacks.map((attack: any) => ({
            attackNumber: attack.order,
            stars: attack.stars,
            destruction: attack.destructionPercentage,
            warId: war.id,
            playerId: player.id,
          }));

          await tx
            .insert(attacks)
            .values(attacksToInsert)
            .onConflictDoNothing();
        });
      }
    } catch (err: any) {
      console.error(
        `[saveWarStatsQueue] erro ao salvar stats da guerra ${clanTag}:`,
        err.message,
      );
      return;
    }

    await findWarQueue.add(
      "find-war-job",
      { clanTag },
      {
        delay: 0,
        jobId: `find-war-${clanTag}`,
        removeOnComplete: true,
      },
    );
  },
  { connection: redisConnection, concurrency: 1 },
);
