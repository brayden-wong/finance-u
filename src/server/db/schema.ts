// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  binary,
  char,
  mysqlTableCreator,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { nanoid } from "nanoid";

const ID_LENGTH = 16;

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `finance-u_${name}`);

export const user = mysqlTable(
  "user",
  {
    id: char("id", { length: ID_LENGTH })
      .primaryKey()
      .$defaultFn(() => nanoid(ID_LENGTH)),
    firstName: varchar("first_name", { length: 32 }).notNull(),
    lastName: varchar("last_name", { length: 32 }).notNull(),
    email: varchar("email", { length: 64 }).notNull().unique(),
    password: text("password").notNull(),
    avatar: binary("avatar", { length: 255 }),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => ({
    index: uniqueIndex("email").on(t.email),
  }),
);
