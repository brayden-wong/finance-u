import { Elysia } from "elysia";
import { auth } from "./auth";
import { db } from "./db";
import { users } from "./users";
import { accounts } from "./accounts";

const api = new Elysia()
  .use(db)
  .use(auth)
  .use(accounts)
  .use(users)
  .listen(8080);

console.log("-".repeat(50));
api.routes.map((route) => console.log(`${route.method} - ${route.path}`));
console.log("-".repeat(50));

export type Api = typeof api;
