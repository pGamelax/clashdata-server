import { BadRequest } from "@/errors/Errors";
import { prisma } from "@/lib/prisma";

export class ClanRepository {
  async create({
    clanTag,
    name,
    userId,
  }: {
    clanTag: string;
    name: string;
    userId: string;
  }) {
    const clanCreated = await prisma.clan.create({
      data: {
        name,
        tag: clanTag,
        userId,
      },
    });
    return clanCreated;
  }

  async findByTag({ clanTag }: { clanTag: string }) {
    const clan = await prisma.clan.findFirst({
      where: {
        tag: clanTag,
      },
    });

    if (!clan) {
      throw new BadRequest("Clan not found");
    }

    return clan;
  }

  async findAllByUser({ userId }: { userId: string }) {
    const clansByUser = await prisma.clan.findMany({
      where: {
        userId,
      },
    });

    return clansByUser;
  }
}
