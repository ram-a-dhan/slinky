import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../database/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export const useDb = () => {
  if (!_db) {
		let url: string | undefined;
    let authToken: string | undefined;

		try {
			// For use in Nuxt environment where runtime config is available
			const config = useRuntimeConfig();
			url = config.TURSO_DB_URL;
			authToken = config.TURSO_AUTH_TOKEN;
		} catch {
			// Fallback for other environments (e.g., during build or in scripts)
			url = process.env.TURSO_DB_URL;
			authToken = process.env.TURSO_AUTH_TOKEN;	
		}

		const client = createClient({
			url: url!,
			authToken,
		})
		_db = drizzle(client, { schema });
  }

  return _db;
};
