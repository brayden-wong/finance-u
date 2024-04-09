import { zodResolver } from "@hookform/resolvers/zod";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
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

import { signIn } from "./actions/sign-in";

const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8),
});

type SignInProps = {
  changeForm: () => void;
  close: () => void;
};

type SignIn = z.infer<typeof SignInSchema>;

export function SignIn({ changeForm, close }: SignInProps) {
  const form = useForm<SignIn>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignIn) {
    await signIn(data);
  }

  return (
    <Form {...form}>
      <form
        className="space-y-2"
        action={async () => {
          await onSubmit(form.getValues());
        }}
      >
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
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => {
              form.reset();
              changeForm();
            }}
          >
            <span className="text-primary hover:underline">Sign Up</span>
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
        "Sign In"
      )}
    </Button>
  );
}
