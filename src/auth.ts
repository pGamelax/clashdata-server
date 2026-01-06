import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database/client";
import { admin, openAPI } from "better-auth/plugins";
import { users } from "./database/schema/users";

export const auth = betterAuth({
  basePath: "/auth",
  plugins: [openAPI(), admin()],
  trustedOrigins: ["https://clashdata.pro", "https://api.clashdata.pro"],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  advanced: {
    useSecureCookies: true,
    database: {
      generateId: false,
    },
    cookiePrefix: "clashdata",
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    password: {
      hash: (password) => Bun.password.hash(password),
      verify: ({ password, hash }) => Bun.password.verify(password, hash),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  cookie: {
    domain: "clashdata.pro",
    attributes: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
    },
  },
});
