import { betterAuthPlugin } from "@/http/plugins/better-auth";
import Elysia, { t } from "elysia"; // Certifique-se de importar 't' para validação
import { DashboardService } from "./service";

const dashboardService = new DashboardService();

export const dashboard = new Elysia({ prefix: "/dashboard" })
  .use(betterAuthPlugin)
  .get(
    "/data",
    async ({ query, user }) => {
      const { clanTag } = query;

      const dashboard = await dashboardService.getDashboardFromAPI({
        clanTag,
        userId: user.id,
      });

      return dashboard;
    },
    {
      auth: true,

      query: t.Object({
        clanTag: t.String(),
      }),
    },
  );
