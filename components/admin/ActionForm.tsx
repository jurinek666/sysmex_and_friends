"use client";

import { useActionState, useEffect } from "react";
import { ErrorMessage } from "./ErrorMessage";
import { SuccessMessage } from "./SuccessMessage";
import { PendingButton } from "@/components/ui/PendingButton";

interface ActionFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<{ success: boolean; error?: string }>;
  successMessage?: string;
  children: React.ReactNode;
  className?: string;
  onSuccess?: () => void;
  submitButtonText?: string;
  submitButtonClassName?: string;
}

export function ActionForm({
  action,
  successMessage = "Operace proběhla úspěšně",
  children,
  className,
  onSuccess,
  submitButtonText = "Odeslat",
  submitButtonClassName,
}: ActionFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success && onSuccess) {
      onSuccess();
    }
  }, [state?.success, onSuccess]);

  return (
    <form action={formAction} className={className}>
      {state?.success === false && state.error && (
        <ErrorMessage message={state.error} />
      )}
      {state?.success === true && (
        <SuccessMessage message={successMessage} />
      )}
      {children}
      <PendingButton
        disabled={isPending}
        className={submitButtonClassName || "w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"}
      >
        {isPending ? "Zpracovává se..." : submitButtonText}
      </PendingButton>
    </form>
  );
}
