import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
  priority: text("priority").default("mid").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
