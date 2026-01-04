import { env } from "@/env";
import { adminPlugin } from "@/http/plugins/admin-auth";
import { betterAuthPlugin } from "@/http/plugins/better-auth";
import axios from "axios";
import Elysia from "elysia";

export const players = new Elysia({ prefix: "/players" })
  .use(betterAuthPlugin)
  .get(
    "/:playerTag",
    async ({ params, user }) => {
      const { playerTag } = params;

      const response = await axios.get(
        `https://api.clashofclans.com/v1/players/${encodeURIComponent(playerTag)}`,
        { headers: { Authorization: `Bearer ${env.TOKEN_COC}` } },
      );

      return response.data;
    },
    {
      auth: true,
    },
  );
