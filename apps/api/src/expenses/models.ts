import Elysia, { t } from "elysia";
import { ExpensesModel } from "./constants";
import { LENGTH } from "../db";

const Expense = t.Object({
  accountId: t.Union([
    t.String({ minLength: LENGTH, maxLength: LENGTH }),
    t.Null(),
  ]),
  name: t.String({ minLength: 2 }),
  amount: t.Number(),
  startDate: t.Date(),
  endDate: t.Optional(t.Date()),
});

const CreateExpense = new Elysia({ name: ExpensesModel.create }).model(
  ExpensesModel.create,
  t.Union([t.Array(Expense), Expense])
);

export const ExpenseModel = new Elysia({ name: "expenses model" }).use(
  CreateExpense
);
