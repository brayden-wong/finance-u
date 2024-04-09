import type { Config } from "drizzle-kit";

export default {
  driver: "pg",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    connectionString: "postgres://root:root@localhost:5432/finance",
  },
} satisfies Config;
