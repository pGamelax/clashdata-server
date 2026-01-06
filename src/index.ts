import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { z } from "zod";

import { adminPlugin } from "./http/plugins/admin-auth";
import { betterAuthPlugin, OpenAPI } from "./http/plugins/better-auth";
//bullboard
//import { serverAdapter } from "./bullmq";

//workers bullmq
// import "./workers/find-war-queue";
// import "./workers/save-stats-war.queue";

//controllers
import { dashboard } from "./modules/dashboard";
import { clans } from "./modules/clans";
import { players } from "./modules/players";

//errors handler
import { BadRequest } from "./errors/Errors";

const app = new Elysia()
  .use(
    cors({
      origin: "https://clashdata.pro",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: ["set-cookie"],
    }),
  )
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    }),
  )
  .error({ BadRequest })
  .use(betterAuthPlugin)
  .use(adminPlugin)
  .use(clans)
  .use(dashboard)
  .use(players)
  .get("/", () => "Hello Elysia", {
    auth: true,
  })
  .get(
    "/users/:id",
    ({ params, user }) => {
      const userId = params.id;
      const authenticatedUserName = user.name;

      return { id: userId, name: authenticatedUserName };
    },
    {
      auth: true,
      admin: true,
      detail: {
        summary: "Get user by ID",
        description: "Retrieve a user by their unique ID.",
        tags: ["User"],
      },
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.object({
          id: z.string(),
          name: z.string(),
        }),
      },
    },
  )
  .listen({ hostname: "0.0.0.0", port: 3333 });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
