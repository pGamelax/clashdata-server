import { betterAuthPlugin } from "@/http/plugins/better-auth";
import Elysia, { t } from "elysia";
import { PushService } from "./service";


const pushService = new PushService();

export const push = new Elysia({ prefix: "/push" })
  .use(betterAuthPlugin)
  .get(
    "/get-attacks",
    async ({ query, user }) => {
      const { clanTag } = query;

      const attacksByClan = await pushService.getLegendAttacksByClan({
        clanTag,
        userId: user.id,
      });

      return attacksByClan;
    },
    {
      auth: true,

      query: t.Object({
        clanTag: t.String(),
      }),
    },
  );
