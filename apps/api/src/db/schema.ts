import { relations, sql } from "drizzle-orm";
import {
  char,
  pgTable,
  text,
  timestamp,
  decimal,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";
import { AccountType } from "../constants/account-type";

export const typeEnum = pgEnum("type", AccountType);

export const LENGTH = 21;

export const users = pgTable("users", {
  id: char("id", { length: LENGTH })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  expenses: many(expenses),
}));

export const InsertUserSchema = createInsertSchema(users);
export const SelectUserSchema = createSelectSchema(users);

export const accounts = pgTable("accounts", {
  id: char("id", { length: LENGTH })
    .primaryKey()
    .$defaultFn(() => nanoid(LENGTH)),
  userId: char("user_id", { length: LENGTH })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: typeEnum("type").notNull(),
  balance: decimal("balance", { precision: 8, scale: 2 }).notNull(),
});

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const InsertAccountSchema = createInsertSchema(accounts);
export const SelectAccountSchema = createSelectSchema(accounts);

export const expenses = pgTable("expenses", {
  id: char("id", { length: LENGTH })
    .primaryKey()
    .$defaultFn(() => nanoid(LENGTH)),
  accountId: char("account_id", { length: LENGTH }).references(
    () => accounts.id,
    { onDelete: "cascade" }
  ),
  userId: char("user_id", { length: LENGTH })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: decimal("amount", { precision: 8, scale: 2 }).notNull(),
  startDate: date("start_date", { mode: "date" }).notNull(),
  endDate: date("end_date", { mode: "date" }),
});

export const expenseRelations = relations(expenses, ({ one }) => ({
  account: one(accounts, {
    fields: [expenses.accountId],
    references: [accounts.id],
  }),
  user: one(users, {
    fields: [expenses.userId],
    references: [users.id],
  }),
}));

export const InsertExpenseSchema = createInsertSchema(expenses);
export const SelectExpenseSchema = createSelectSchema(expenses);
