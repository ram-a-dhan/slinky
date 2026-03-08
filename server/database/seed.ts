import { eq } from "drizzle-orm";
import { useDb } from "../utils/db";
import { users, links } from "./schema";

const seed = async () => {
  const db = useDb();

  try {
    console.log("🌱 Seeding started...");
    await db.delete(users);
    await db.delete(links);

    console.log("🕒 Seeding users...");
    const exampleUsers = [
      {
        email: "exampleuser@examplemail.com",
        username: "exampleuser",
      }
    ];
    const insertedUsers = await db.insert(users).values(exampleUsers);
    console.log("✅ Users seeded:", insertedUsers);

    console.log("🕒 Seeding links...");
    const selectedUser = await db.select().from(users).where(eq(users.email, exampleUsers[0]!.email));
    const exampleLinks = [
      {
        slug: "dQw4w9WgXcQ",
        target: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        slug: "examplelink",
        target: "https://www.example.com",
        userId: selectedUser[0]!.id,
      }
    ];
    const insertedLinks = await db.insert(links).values(exampleLinks);
    console.log("✅ Links seeded:", insertedLinks);

    console.log("🌱 Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();