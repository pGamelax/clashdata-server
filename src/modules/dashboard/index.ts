import { betterAuthPlugin } from "@/http/plugins/better-auth";
import Elysia from "elysia";
import { DashboardService } from "./service";
import { DashboardModel } from "./model";

const dashboardService = new DashboardService();

export const dashboard = new Elysia({ prefix: "/dashboard" })
  .use(betterAuthPlugin)
  .get(
    "/data/:clanTag",
    async ({ params, user }) => {
      const { clanTag } = params;
      const dashboard = await dashboardService.getDashboardFromAPI({
        clanTag,
        userId: user.id,
      });
      return dashboard;
    },
    {
      auth: true,
      params: DashboardModel.paramsDashboard,
    },
  );
