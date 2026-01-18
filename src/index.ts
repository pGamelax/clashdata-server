import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { z } from "zod";

import { adminPlugin } from "./http/plugins/admin-auth";
import { betterAuthPlugin, OpenAPI } from "./http/plugins/better-auth";

//controllers
import { dashboard } from "./modules/dashboard";
import { clans } from "./modules/clans";
import { players } from "./modules/players";
import { push } from "./modules/push";

//errors handler
import { BadRequest } from "./errors/Errors";
import { env } from "./env";

const app = new Elysia()
  .use(
    cors({
      origin: env.BETTER_AUTH_TRUSTED_ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: ["set-cookie"],
    })
  )
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    })
  )
  .error({ BadRequest })
  .use(betterAuthPlugin)
  .use(adminPlugin)
  .use(clans)
  .use(dashboard)
  .use(players)
  .use(push)
  .listen({ hostname: "0.0.0.0", port: 3333 });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
