import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CircleX, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { signUp } from "./actions/sign-up";

const MotionEye = motion(Eye);
const MotionEyeOff = motion(EyeOff);

const SignUpSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

type SignUpProps = {
  changeForm: () => void;
  close: () => void;
};

type SignUp = z.infer<typeof SignUpSchema>;

export function SignUp({ changeForm, close }: SignUpProps) {
  const [show, setShow] = useState(false);
  const form = useForm<SignUp>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignUp) {
    console.log("submitting form");
    const response = await signUp(data);

    console.log(response);

    if (typeof response === "string")
      return toast(response, {
        icon: <CircleX className="h-4 w-4 text-red-400" />,
        position: "top-right",
      });

    return toast("Account created successfully");
  }

  return (
    <Form {...form}>
      <form
        className="space-y-2"
        action={async () => {
          await onSubmit(form.getValues());
        }}
      >
        <div className="flex w-full items-center justify-start gap-x-2">
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative flex items-center">
                <FormControl>
                  <Input
                    type={show ? "text" : "password"}
                    {...field}
                    className="pr-8"
                  />
                </FormControl>
                <div className="absolute flex w-full items-center">
                  <MotionEye
                    className="absolute right-3 h-4 w-4 cursor-pointer"
                    animate={{
                      opacity: show ? 0 : 1,
                      pointerEvents: show ? "none" : "auto",
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    onClick={() => setShow(true)}
                  />
                  <MotionEyeOff
                    className="absolute right-3 h-4 w-4 cursor-pointer"
                    animate={{
                      opacity: show ? 1 : 0,
                      pointerEvents: show ? "auto" : "none",
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    onClick={() => setShow(false)}
                  />
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <p>
          Have an account?{" "}
          <button
            type="button"
            onClick={() => {
              form.reset();
              changeForm();
            }}
          >
            <span className="text-primary hover:underline">Sign In</span>
          </button>
        </p>
        <div className="flex items-center justify-start gap-x-2">
          <SubmitButton />
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              form.reset();
              close();
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="w-32 disabled:opacity-100"
    >
      {pending ? (
        <LoadingSpinner className="h-6 w-6 border-neutral-400 border-t-neutral-50" />
      ) : (
        "Sign Up"
      )}
    </Button>
  );
}
