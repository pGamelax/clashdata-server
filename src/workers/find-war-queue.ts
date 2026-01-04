import { Worker } from "bullmq";
import { findWarQueue, redisConnection, saveWarStatsQueue } from "../bullmq.js";
import axios from "axios";
import dayjs from "dayjs";
import { env } from "@/env";

const TOKEN_COC = env.TOKEN_COC;

new Worker(
  "findWar-queue",
  async (job) => {
    const { clanTag } = job.data;

    try {
      const response = await axios.get(
        `https://api.clashofclans.com/v1/clans/${encodeURIComponent(
          clanTag,
        )}/currentwar`,
        { headers: { Authorization: `Bearer ${TOKEN_COC}` } },
      );

      const state = response.data.state;

      console.log(`[findWarQueue] ${clanTag} estado: ${state}`);

      if (state === "inWar" || state === "preparation") {
        const isoEndTime = response.data.endTime.replace(
          /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})\.(\d+)Z$/,
          "$1-$2-$3T$4:$5:$6.$7Z",
        );

        await saveWarStatsQueue.add(
          "save-war-stats-job",
          { clanTag },
          {
            delay: dayjs(isoEndTime).diff(dayjs().format()),
            jobId: `save-war-${clanTag}-${isoEndTime}`,
          },
        );
      } else {
        try {
          await findWarQueue.add(
            "find-war-job",
            { clanTag },
            {
              delay: 30
              * 60 * 1000,
              removeOnComplete: true,
              removeOnFail: true,
            },
          );
        } catch (err: any) {
          console.log(err.message);
        }
      }
    } catch (err: any) {
      console.error(
        `[findWarQueue] erro ao buscar guerra ${clanTag}:`,
        err.message,
      );
      await findWarQueue.add(
        "find-war-job",
        { clanTag },
        {
          delay: 30 * 60 * 1000,
          jobId: `find-war-${clanTag}`,
        },
      );
    }
  },
  { connection: redisConnection, concurrency: 5 },
);
