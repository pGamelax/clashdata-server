import { db } from "@/database/client";
import { users } from "@/database/schema/users";
import { eq } from "drizzle-orm";

export class UserRepository {
  async findByEmail({ email }: { email: string }) {
    const [userFound] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return userFound;
  }
}
