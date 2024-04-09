export const ExpensesRoutes = {
  index: "/",
  id: "/:id",
} as const;

export const ExpensesModel = {
  create: "create",
  getSingle: "get single",
  getMultiple: "get multiple",
  update: "update",
} as const;
