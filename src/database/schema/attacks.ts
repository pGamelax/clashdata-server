import {
  pgTable,
  text,
  timestamp,
  integer,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { wars } from "./wars";
import { players } from "./players";
import { randomUUIDv7 } from "bun";

export const attacks = pgTable(
  "attacks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUIDv7()),
    warId: text("war_id")
      .notNull()
      .references(() => wars.id, { onDelete: "cascade" }),
    playerId: text("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    stars: integer("stars").notNull(),
    destruction: integer("destruction").notNull(),
    attackNumber: integer("attack_number").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    warIdIdx: index("attacks_war_id_idx").on(table.warId),
    playerIdIdx: index("attacks_player_id_idx").on(table.playerId),
    // Mapeia o @@unique([warId, playerId, attackNumber])
    warPlayerAttackUnique: unique("war_player_attack_unique").on(
      table.warId,
      table.playerId,
      table.attackNumber,
    ),
  }),
);

export const attacksRelations = relations(attacks, ({ one }) => ({
  war: one(wars, {
    fields: [attacks.warId],
    references: [wars.id],
  }),
  player: one(players, {
    fields: [attacks.playerId],
    references: [players.id],
  }),
}));
