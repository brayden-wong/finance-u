"use client";

import { useEffect } from "react";
import { useTellerConnect } from "teller-connect-react";

import { Button } from "@/components/ui/button";

import { action } from "../action";

export function TellerConnect() {
  const { open, ready } = useTellerConnect({
    applicationId: "app_os9m5hdg4182920f7u000",
    onSuccess: async (authorization) => {
      console.log(authorization);
      await action(authorization.accessToken);
    },
  });

  // console.log(error);

  // useEffect(() => {
  //   const api = async () => {
  //     await action("token_obtll5lplaczq5ogebu7rvwm3m");
  //   };

  //   api();
  // });

  return (
    <div>
      <Button onClick={() => open()} disabled={!ready}>
        Open
      </Button>
    </div>
  );
}
