import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { env } from "bun";

if (!env.AUTH_SECRET) throw new Error("Auth secret is required");

const Jwt = new Elysia({ prefix: "jwt" }).use(
  jwt({
    name: "jwt",
    secret: env.AUTH_SECRET,
    exp: "15m",
  })
);

export { Jwt as jwt };
