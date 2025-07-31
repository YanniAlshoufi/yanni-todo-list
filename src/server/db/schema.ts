import { sql } from "drizzle-orm";
import { index, sqliteTableCreator } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator((name) => `web_${name}`);

export const todos = createTable(
  "todos",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: d.text({ mode: 'text' }).notNull(),
    title: d.text({ length: 256 }).notNull(),
    isDone: d.integer({ mode: "boolean" }).notNull(),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [index("title_idx").on(t.title)],
);
