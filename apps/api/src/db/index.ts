import { Client } from "pg";

import { drizzle } from "drizzle-orm/node-postgres";
import { Elysia } from "elysia";
import * as schema from "./schema";
import { env } from "bun";

const url = env.DB_URL;

if (!url) throw new Error("database url is undefined");

const client = new Client({
  connectionString: url,
});

await client.connect();

const database = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === "development" ? true : false,
});

export const db = new Elysia({ name: "drizzle" }).decorate("db", database);

export * from "./schema";
