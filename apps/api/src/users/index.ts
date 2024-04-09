import { Elysia, NotFoundError, t } from "elysia";
import { db } from "../db";
import { jwt } from "../jwt";
import { eq } from "drizzle-orm";
import { users as userModel } from "../db/schema";

export const users = new Elysia({ prefix: "/users", name: "users" })
  .use(db)
  .use(jwt)
  .guard(
    {
      headers: t.Object({
        authorization: t.TemplateLiteral("Bearer ${string}"),
      }),
    },
    (app) =>
      app
        .resolve(async ({ set, headers: { authorization }, jwt }) => {
          const bearer = authorization.split(" ")[1];

          if (!bearer) {
            throw new NotFoundError("No token provided");
          }

          const decoded = await jwt.verify(bearer);

          if (!decoded || !decoded.sub) {
            set.status = 401;

            throw new Error("Invalid token");
          }

          return { id: decoded.sub };
        })
        .get("/me", async ({ set, id, db }) => {
          const user = await db.query.users.findFirst({
            columns: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
            where: eq(userModel.id, id),
          });

          if (!user) {
            set.status = 404;

            throw new NotFoundError("User not found");
          }

          return user;
        })
  );
