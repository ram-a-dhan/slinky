import { ResultSet } from "@libsql/client";
import { SQL, sql } from "drizzle-orm";
import type { BaseSQLiteDatabase, SQLiteTable } from "drizzle-orm/sqlite-core";

type DbOrTx = BaseSQLiteDatabase<"async", ResultSet, Record<string, unknown>>;

interface IAccessOptions {
  count?: boolean;
  time?: boolean;
}

export const access = async (dbtx: DbOrTx, schema: SQLiteTable, whereClause: SQL, options?: IAccessOptions) => {
  const {
    count = true,
    time = true,
  } = options || {};

  return await dbtx
    .update(schema)
    .set({
      ...(count ? {
        hitCount: sql`hit_count + 1`,
      } : {}),
      ...(time ? {
        lastAccessedAt: new Date(),
      } : {}),
    })
    .where(whereClause);
};