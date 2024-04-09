import { Elysia, NotFoundError, t } from "elysia";
import dayjs from "dayjs";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../db";
import { password } from "bun";
import { jwt } from "../jwt";
import { AuthModels } from "./models";
import { AuthModel, AuthRoutes } from "./constants";

export const auth = new Elysia({ prefix: "/auth" })
  .use(db)
  .use(jwt)
  .use(AuthModels)
  .model(
    "error",
    t.Object({
      timestamp: t.Date(),
      message: t.String(),
    })
  )
  .post(
    AuthRoutes.register,
    async ({ body, db, set }) => {
      const result = await db.transaction(async (tx) => {
        const user = await tx.query.users.findFirst({
          where: eq(users.email, body.email),
        });

        if (user) return "Email is already in use";

        const hash = await password.hash(body.password);

        const newUser = await db
          .insert(users)
          .values({
            ...body,
            password: hash,
          })
          .returning({ id: users.id })
          .then((result) => result[0]!)
          .catch(() => "Error creating user" as const);

        if (typeof newUser === "string") return newUser;

        return newUser;
      });

      if (typeof result === "string") {
        set.status = 500;

        throw new Error(result);
      }

      set.status = 200;

      return {
        id: result.id,
      };
    },
    {
      body: AuthModel.register,
      transform: ({ body }) => {
        body.email = body.email.toLowerCase();
      },
    }
  )
  .post(
    AuthRoutes.login,
    async ({ body, db, jwt, set }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.email, body.email),
      });

      if (!user) {
        set.status = 404;

        throw new NotFoundError("User not found");
      }

      const match = await password.verify(body.password, user.password);

      if (!match) {
        set.status = 401;

        throw new Error("Invalid Credentails");
      }

      const token = await jwt.sign({ sub: user.id });

      const expiration = dayjs().add(15, "minutes").toDate();

      return {
        token,
        expiration,
      };
    },
    {
      body: AuthModel.login,
      transform: ({ body }) => {
        body.email = body.email.toLowerCase();
      },
    }
  )
  .post(AuthRoutes.refresh, async ({ headers, jwt, set }) => {
    const token = headers["authorization"]?.split(" ")[1];

    if (!token) {
      set.status = 403;

      throw new Error("No token provided");
    }

    const decodedToken = await jwt.verify(token);

    if (!decodedToken || !decodedToken.sub) {
      set.status = 401;

      throw new Error("Invalid token");
    }

    const newToken = await jwt.sign({ sub: decodedToken.sub });

    return {
      token: newToken,
      expiration: dayjs().add(15, "minutes").toDate(),
    };
  });
