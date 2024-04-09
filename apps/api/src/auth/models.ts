import { Elysia, t } from "elysia";
import { AuthModel } from "./constants";

const RegisterUser = new Elysia({ name: AuthModel.register }).model(
  AuthModel.register,
  t.Object({
    firstName: t.String({ minLength: 2, error: "first name is required" }),
    lastName: t.String({ minLength: 2, error: "last name is required" }),
    email: t.String({ format: "email", error: "email is required" }),
    password: t.String({ minLength: 8, error: "password is required" }),
  })
);

const LoginUser = new Elysia({ name: AuthModel.login }).model(
  AuthModel.login,
  t.Object({
    email: t.String({ minLength: 2, format: "email" }),
    password: t.String({ minLength: 8 }),
  })
);

export const AuthModels = new Elysia({ name: "AuthModels" })
  .use(RegisterUser)
  .use(LoginUser);
