import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { clans } from "./clans";
import { randomUUIDv7 } from "bun";
import { attacks } from "./attacks";

export const wars = pgTable(
  "wars",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUIDv7()),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    clanId: text("clan_id")
      .notNull()
      .references(() => clans.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    clanIdIdx: index("war_clan_id_idx").on(table.clanId),
  }),
);

export const warsRelations = relations(wars, ({ one, many }) => ({
  clan: one(clans, {
    fields: [wars.clanId],
    references: [clans.id],
  }),
  attacks: many(attacks),
}));
