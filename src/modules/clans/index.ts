import { adminPlugin } from "@/http/plugins/admin-auth";
import { betterAuthPlugin } from "@/http/plugins/better-auth";
import { Elysia, t } from "elysia";
import { ClanModel } from "@/modules/clans/model";
import { ClanServiceImpl } from "./service";

export const clans = new Elysia({ prefix: "/clans" })
  .use(betterAuthPlugin)
  .use(adminPlugin)
  .post(
    "/create",
    async ({ body }) => {
      const clanService = new ClanServiceImpl();

      const clanCreated = await clanService.createClan({
        clanTag: body.clanTag,
        userEmail: body.userEmail,
      });

      return clanCreated;
    },
    {
      auth: true,
      admin: true,
      detail: {
        summary: "Create clan",
        description: "Create a clan to user.",
        tags: ["Clan"],
      },
      body: ClanModel.createBody,
      response: {
        200: ClanModel.createResponse,
        400: ClanModel.createInvalid,
      },
    },
  )
  .get(
    "/get-clans",
    async ({ user }) => {
      const clanService = new ClanServiceImpl();

      const clans = await clanService.getAllClans({ userId: user.id });

      return clans;
    },
    {
      auth: true,
    },
  )
  .post(
    "/start-queue",
    async ({ body }) => {
      const clanService = new ClanServiceImpl();

      const clanStarted = await clanService.startQueue({
        clanTag: body.clanTag,
      });

      return clanStarted;
    },
    {
      auth: true,
      admin: true,
      detail: {
        summary: "Start queue",
        description: "Start a queue for a clan.",
        tags: ["Clan"],
      },
      body: ClanModel.startQueueBody,
      response: {
        200: ClanModel.startQueueResponse,
        400: ClanModel.startQueueInvalid,
      },
    },
  )
  .get(
    "/info", // Removido o :clanTag do path
    async ({ query }) => {
      // Alterado de params para query
      const { clanTag } = query;
      const clanService = new ClanServiceImpl();

      const clanInfo = await clanService.getClanInfo({
        clanTag: clanTag,
      });

      return clanInfo;
    },
    {
      auth: true,
      detail: {
        summary: "Get clan info",
        description: "Get info for a clan.",
        tags: ["Clan"],
      },

      query: t.Object({
        clanTag: t.String(),
      }),
      response: {
        200: ClanModel.clanInfoResponse,
        400: ClanModel.clanInfoInvalid,
      },
    },
  );
