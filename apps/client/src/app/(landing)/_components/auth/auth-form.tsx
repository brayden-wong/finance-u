"use client";

import { useCallback, useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";

import { SignIn } from "./sign-in";
import { SignUp } from "./sign-up";

export function AuthForm({ type }: { type: "sign-in" | "sign-up" }) {
  const [open, onOpenChange] = useState(false);
  const [formType, setFormType] = useState<"sign-in" | "sign-up">(type);

  const changeForm = useCallback(() => {
    setFormType((current) => (current === "sign-in" ? "sign-up" : "sign-in"));
  }, [formType]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger
        className={buttonVariants({
          variant: type === "sign-in" ? "default" : "outline",
        })}
      >
        {type === "sign-in" ? "Sign In" : "Sign Up"}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-fit">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-4xl">
            {formType === "sign-in" ? "Sign In" : "Sign Up"}
          </AlertDialogTitle>
        </AlertDialogHeader>
        {formType === "sign-in" ? (
          <SignIn changeForm={changeForm} close={() => onOpenChange(false)} />
        ) : (
          <SignUp changeForm={changeForm} close={() => onOpenChange(false)} />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
