import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sessions } from "./sessions";
import { accounts } from "./accounts";
import { relations } from "drizzle-orm";
import { randomUUIDv7 } from "bun";

export const userRoleEnum = pgEnum("user_role", ["user", "admin", "moderator"]);

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  role: userRoleEnum("role").default("user").notNull(),
  banned: boolean("banned").default(false).notNull(),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
}));
