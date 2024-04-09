import { z } from "zod";
import { SelectUserSchema } from "../db/schema";

type UserColumns = z.infer<typeof SelectUserSchema>;

type UserColumnParams = Partial<Record<keyof UserColumns, boolean>>;

export function getUserColumns<T extends Partial<UserColumnParams>>(data: T) {
  const columns: Record<keyof UserColumnParams, boolean> = {
    createdAt: false,
    email: false,
    id: false,
    firstName: false,
    lastName: false,
    updatedAt: false,
    password: false,
  };

  for (const key in data) {
    if (data[key]) {
      columns[key as keyof UserColumnParams] = true;
    }
  }

  return columns;
}
