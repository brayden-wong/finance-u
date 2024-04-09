export const AccountsRoutes = {
  create: "/create",
  id: "/:id",
  index: "/",
} as const;

export const AccountModel = {
  create: "create",
  getSingle: "get single",
  getMultiple: "get multiple",
  update: "update",
} as const;
