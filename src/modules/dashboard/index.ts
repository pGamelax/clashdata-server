import { betterAuthPlugin } from "@/http/plugins/better-auth";
import Elysia, { t } from "elysia"; // Certifique-se de importar 't' para validação
import { DashboardService } from "./service";

const dashboardService = new DashboardService();

export const dashboard = new Elysia({ prefix: "/dashboard" })
  .use(betterAuthPlugin)
  .get(
    "/data",
    async ({ query, user }) => {
      const { clanTag } = query; // Agora pegamos de 'query' em vez de 'params'

      const dashboard = await dashboardService.getDashboardFromAPI({
        clanTag,
        userId: user.id,
      });

      return dashboard;
    },
    {
      auth: true,
      // Alterado: Validamos 'query' em vez de 'params'
      query: t.Object({
        clanTag: t.String(),
      }),
    },
  );
