import axios from "axios";
import { UserRepository } from "../users/repository";
import { ClanModel } from "./model";
import { ClanRepository } from "./repository";
import { env } from "@/env";
import { BadRequest } from "@/errors/Errors";

export abstract class ClanService {
  abstract createClan({
    clanTag,
    userEmail,
  }: {
    clanTag: string;
    userEmail: string;
  }): Promise<ClanModel.Clan>;

  abstract startQueue({
    clanTag,
  }: {
    clanTag: string;
  }): Promise<{ message: string }>;

  abstract getClanInfo({
    clanTag,
  }: {
    clanTag: string;
  }): Promise<ClanModel.ClanInfoResponse>;

  abstract getAllClans({
    userId,
  }: {
    userId: string;
  }): Promise<ClanModel.Clan[]>;
}

export class ClanServiceImpl extends ClanService {
  async createClan({
    clanTag,
    userEmail,
  }: {
    clanTag: string;
    userEmail: string;
  }): Promise<ClanModel.Clan> {
    const clanRepository = new ClanRepository();
    const userRepository = new UserRepository();

    const response = await axios.get(
      `https://api.clashofclans.com/v1/clans/${encodeURIComponent(clanTag)}`,
      { headers: { Authorization: `Bearer ${env.TOKEN_COC}` } },
    );

    if (!response.data) {
      throw new Error("Clan not found");
    }

    const user = await userRepository.findByEmail({ email: userEmail });

    if (!user) {
      throw new Error("User not found");
    }

    const clanCreated = await clanRepository.create({
      clanTag,
      name: response.data.name,
      userId: user.id,
    });

    return {
      ...clanCreated,
      createdAt: clanCreated.createdAt.toISOString(),
      updatedAt: clanCreated.updatedAt.toISOString(),
    };
  }

  async startQueue({
    clanTag,
  }: {
    clanTag: string;
  }): Promise<{ message: string }> {
    const clanRepository = new ClanRepository();

    const clan = await clanRepository.findByTag({ clanTag: clanTag });

    if (!clan) {
      throw new BadRequest("Clan not found");
    }

    return { message: `Queue started with successfully to clan ${clan.name}` };
  }

  async getClanInfo({
    clanTag,
  }: {
    clanTag: string;
  }): Promise<ClanModel.ClanInfoResponse> {
    const response = await axios.get(
      `https://api.clashofclans.com/v1/clans/${encodeURIComponent(clanTag)}`,
      { headers: { Authorization: `Bearer ${env.TOKEN_COC}` } },
    );

    if (!response.data) throw new BadRequest("Clan not found");

    return {
      ...response.data,
      totalWars:
        response.data.warWins + response.data.warLosses + response.data.warTies,
    };
  }

  async getAllClans({ userId }: { userId: string }): Promise<ClanModel.Clan[]> {
    const clanRepository = new ClanRepository();

    const clans = await clanRepository.findAll({ userId });
    if (!clans) return [];

    return clans.map((clan) => ({
      ...clan,
      createdAt: clan.createdAt.toISOString(),
      updatedAt: clan.updatedAt.toISOString(),
    }));
  }
}
