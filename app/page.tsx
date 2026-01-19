"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, Label, ErrorMessage } from "@/components/ui/fieldset";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (_: { error?: string } | null, formData: FormData) => {
      return login(formData);
    },
    null
  );

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Heading>Dev Scheduler</Heading>
          <Text className="mt-2">
            Enter the password to access the scheduler
          </Text>
        </div>

        <form action={formAction} className="space-y-4">
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              placeholder="Enter password"
              required
              autoFocus
            />
            {state?.error && <ErrorMessage>{state.error}</ErrorMessage>}
          </Field>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
