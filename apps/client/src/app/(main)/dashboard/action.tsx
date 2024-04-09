"use server";

import { env } from "@/env";
import { TellerAccounts } from "@/lib/types/teller-types";
import axios from "axios";
import https from "https";

export async function action(id: string) {
  console.log("action ran");

  const response = await axios.get<TellerAccounts>(
    "https://api.teller.io/accounts",
    {
      headers: {
        "Content-Type": "application/json",
      },
      httpsAgent: new https.Agent({
        cert: env.TELLER_CERT,
        key: env.TELLER_KEY,
      }),
      auth: {
        username: id,
        password: "",
      },
    },
  );

  console.log(response.data);

  // if (response.status !== 200) {
  //   console.log("Error fetching accounts");

  //   return;
  // }

  // console.log(response.data[0]);
}
