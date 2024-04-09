import { Elysia, t } from "elysia";

import { UserModel } from "./constants";
const Me = new Elysia({ name: UserModel.me }).model(UserModel.me, t.Object({}));
