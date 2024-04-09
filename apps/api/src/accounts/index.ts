import { db, accounts as accountsSchema, LENGTH } from "../db";
import { Elysia, NotFoundError, t } from "elysia";
import { jwt } from "../jwt";
import { AccountsModel } from "./models";
import { AccountModel, AccountsRoutes } from "./constants";
import { eq } from "drizzle-orm";

export const accounts = new Elysia({ name: "accounts", prefix: "/accounts" })
  .use(db)
  .use(jwt)
  .use(AccountsModel)
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
        .get(
          AccountsRoutes.index,
          async ({ query, db, id }) => {
            const accounts = await db.query.accounts.findMany({
              where: (accounts, { eq }) => eq(accounts.userId, id),
              limit: query.take !== undefined ? +query.take : 20,
              offset: query.skip !== undefined ? +query.skip : 0,
              orderBy: (accounts, { asc }) => [asc(accounts.name)],
            });

            return accounts;
          },
          {
            query: "get multiple",
          }
        )
        .get(
          AccountsRoutes.id,
          async ({ set, params, db, id }) => {
            const account = await db.query.accounts.findFirst({
              where: (accounts, { and, eq }) =>
                and(eq(accounts.id, params.id), eq(accounts.userId, id)),
            });

            if (!account) {
              set.status = 404;

              return "Account not found";
            }

            return account;
          },
          {
            params: "get single",
          }
        )
        .post(
          AccountsRoutes.create,
          async ({ body, set, db, id }) => {
            const account = await db.transaction(async (tx) => {
              const account = await tx.query.accounts.findFirst({
                where: (accounts, { and, eq }) =>
                  and(eq(accounts.name, body.name), eq(accounts.userId, id)),
              });

              if (!account) {
                const [account] = await tx
                  .insert(accountsSchema)
                  .values({
                    ...body,
                    userId: id,
                    balance: body.balance.toFixed(2),
                  })
                  .returning({ id: accountsSchema.id });

                return account.id;
              }

              set.status = 403;

              throw new Error("account name is taken");
            });

            set.status = 201;

            return { id: account };
          },
          {
            body: AccountModel.create,
          }
        )
        .patch(
          AccountsRoutes.id,
          async ({ set, params, body, db, id }) => {
            if (!body) return "nothing to update";

            const account = await db.transaction(async (tx) => {
              const account = await tx.query.accounts.findFirst({
                where: (accounts, { and, eq }) =>
                  and(eq(accounts.id, params.id), eq(accounts.userId, id)),
              });

              if (!account) {
                set.status = 404;

                return "Cannot find account";
              }

              const [update] = await tx
                .update(accountsSchema)
                .set({
                  ...body,
                  balance: body.balance
                    ? body.balance.toFixed(2)
                    : account.balance,
                })
                .returning({ id: accountsSchema.id });

              set.status = 204;

              return update.id;
            });

            return { account };
          },
          {
            body: "update",
            params: t.Object({
              id: t.String({ minLength: LENGTH, maxLength: LENGTH }),
            }),
          }
        )
        .delete(
          AccountsRoutes.id,
          async ({ set, params, db, id }) => {
            const account = await db.query.accounts.findFirst({
              where: (accounts, { and, eq }) =>
                and(eq(accounts.id, params.id), eq(accounts.userId, id)),
            });

            if (!account) {
              set.status = 404;

              return "account not found";
            }

            const [deletedAccount] = await db
              .delete(accountsSchema)
              .where(eq(accountsSchema.id, params.id))
              .returning({ id: accountsSchema.id });

            if (!deletedAccount) {
              set.status = 500;

              return "failed to delete account";
            }

            set.status = 204;

            return "successfully deleted account";
          },
          {
            params: t.Object({
              id: t.String({ minLength: LENGTH, maxLength: LENGTH }),
            }),
          }
        )
  );
