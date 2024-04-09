type DepositSubtype =
  | "checking"
  | "savings"
  | "money_market"
  | "certificate_of_deposit"
  | "treasury"
  | "sweep";

type DepositAccount = {
  type: "depository";
  subtype: DepositSubtype;
};

type CreditAccount = {
  type: "credit";
  subtype: "credit_card";
};

type Account = DepositAccount | CreditAccount;

export type TellerAccounts = Array<
  Account & {
    id: string;
    enrollment_id: string;
    name: string;
    status: "open" | "closed";
    currency: string;
    last_four: string;
    institution: {
      name: string;
      id: string;
    };
  }
>;
