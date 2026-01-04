import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { attacks } from "./attacks";
import { randomUUIDv7 } from "bun";

export const players = pgTable("players", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  name: text("name").notNull(),
  tag: text("tag").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const playersRelations = relations(players, ({ many }) => ({
  attacks: many(attacks),
}));
