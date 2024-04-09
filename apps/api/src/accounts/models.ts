import { Elysia, t } from "elysia";
import { AccountModel } from "./constants";
import { AccountType } from "../constants/account-type";
import { LENGTH } from "../db";

const CreateAccount = new Elysia({ name: AccountModel.create }).model(
  AccountModel.create,
  t.Object({
    name: t.String({ minLength: 3, error: "name is required" }),
    type: t.Union(
      AccountType.map((type) => t.Literal(type)),
      {
        error: "account type is required",
      }
    ),
    balance: t.Number({ default: 0 }),
  })
);

const GetAccount = new Elysia({ name: AccountModel.getSingle }).model(
  AccountModel.getSingle,
  t.Object({
    id: t.String({ minLength: LENGTH, maxLength: LENGTH }),
  })
);

const GetAccounts = new Elysia({ name: AccountModel.getMultiple }).model(
  AccountModel.getMultiple,
  t.Object({
    take: t.Optional(t.String({ default: "20", minLength: 1 })),
    skip: t.Optional(t.String({ default: "0", minLength: 1 })),
  })
);

const UpdateAccount = new Elysia({ name: AccountModel.update }).model(
  AccountModel.update,
  t.Optional(
    t.Object({
      name: t.Optional(
        t.String({
          minLength: 1,
          error: "Name must be at least 1 character long",
        })
      ),
      type: t.Optional(t.Union(AccountType.map((type) => t.Literal(type)))),
      balance: t.Optional(t.Number({ default: 0 })),
    })
  )
);

export const AccountsModel = new Elysia({ name: "AccountsModel" })
  .use(GetAccount)
  .use(GetAccounts)
  .use(CreateAccount)
  .use(UpdateAccount);
