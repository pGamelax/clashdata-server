import { pgTable, text, timestamp, index, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { wars } from "./wars";
import { randomUUIDv7 } from "bun";

export const clans = pgTable(
  "clans",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUIDv7()),
    name: text("name").notNull().unique(),
    tag: text("tag").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("clan_user_id_idx").on(table.userId),
  }),
);

export const clansRelations = relations(clans, ({ one, many }) => ({
  user: one(users, {
    fields: [clans.userId],
    references: [users.id],
  }),
  wars: many(wars),
}));
