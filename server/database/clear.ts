import { useDb } from "../utils/db";
import { users, links } from "./schema";

const clear = async () => {
  const db = useDb();

  try {
    console.log("🧹 Clearing database...");
    await db.transaction(async (tx) => {
      await tx.delete(links);
      await tx.delete(users);
    });
    console.log("✅ Database cleared!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to clear database:", error);
    process.exit(1);
  }
};

clear();