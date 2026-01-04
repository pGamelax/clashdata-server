import z from "zod";

export namespace DashboardModel {
  export const paramsDashboard = z.object({
    clanTag: z.string(),
  });

  export type ParamsDashboard = z.infer<typeof paramsDashboard>;
}
