import { sql } from "drizzle-orm";
import { useDb } from "../utils/db";
import { users, links, qrOptions } from "./schema";

const destroy = async () => {
  const db = useDb();

  try {
    console.log("💥 Destroying database...");
    await db.transaction(async (tx) => {
      await tx.run(sql`DROP TABLE IF EXISTS ${links};`);
      await tx.run(sql`DROP TABLE IF EXISTS ${qrOptions};`);
      await tx.run(sql`DROP TABLE IF EXISTS ${users};`);
    });
    console.log("✅ Database destroyed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to destroy database:", error);
    process.exit(1);
  }
};

destroy();