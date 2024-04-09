import { Elysia, NotFoundError, t } from "elysia";
import { jwt } from "../jwt";
import { db, expenses as expensesSchema } from "../db";
import { ExpensesModel, ExpensesRoutes } from "./constants";
import { ExpenseModel } from "./models";

export const expenses = new Elysia({ prefix: "/expenses" })
  .use(db)
  .use(jwt)
  .use(ExpenseModel)
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
        .post(
          ExpensesRoutes.index,
          async ({ set, db, body, id }) => {
            const expense = await db.transaction(async (tx) => {
              const expenses = await tx.query.expenses.findMany({
                where: (expense, { eq }) => eq(expense.userId, id),
              });

              if (Array.isArray(body)) {
                const bodyNames = body.map((expense) =>
                  expense.name.toLowerCase()
                );

                const result = expenses.some((expense) =>
                  bodyNames.includes(expense.name.toLowerCase())
                );

                if (result) {
                  set.status = 403;

                  return "expense name is already taken";
                }

                const results = await tx
                  .insert(expensesSchema)
                  .values(
                    body.map((expense) => ({
                      ...expense,
                      userId: id,
                      amount: expense.amount.toFixed(2),
                    }))
                  )
                  .returning({ id: expensesSchema.id });

                if (results.length < 1) {
                  set.status = 500;

                  return "failed to create expenses";
                }

                set.status = 201;

                return "successfully created expenses";
              }

              const expense = expenses.find(
                (expense) =>
                  expense.name.toLowerCase() === body.name.toLowerCase()
              );

              if (expense) {
                set.status = 500;

                return "expense name is already taken";
              }

              const [newExpense] = await tx
                .insert(expensesSchema)
                .values({
                  ...body,
                  userId: id,
                  amount: body.amount.toFixed(2),
                })
                .returning({ id: expensesSchema.id });

              if (!newExpense) {
                set.status = 500;

                return "failed to create expense";
              }

              set.status = 201;

              return "successfully created expense";
            });

            switch (expense) {
              case "failed to create expense":
              case "failed to create expenses":
              case "expense name is already taken":
                return { message: expense };
              case "successfully created expense":
              case "successfully created expenses":
                return { message: expense };
            }
          },
          {
            body: ExpensesModel.create,
          }
        )
  );
