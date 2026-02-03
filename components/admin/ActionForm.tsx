"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "./ErrorMessage";
import { SuccessMessage } from "./SuccessMessage";
import { PendingButton } from "@/components/ui/PendingButton";

interface ActionFormProps {
  action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>;
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
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const previousSuccessRef = useRef(false);

  useEffect(() => {
    if (state?.success && !previousSuccessRef.current) {
      previousSuccessRef.current = true;
      // Always refresh the page data after successful submission
      router.refresh();
      if (onSuccess) {
        onSuccess();
      } else {
        // Reset formuláře pouze pokud není onSuccess callback
        formRef.current?.reset();
      }
    } else if (!state?.success) {
      previousSuccessRef.current = false;
    }
  }, [state?.success, onSuccess, router]);

  return (
    <form ref={formRef} action={formAction} className={className}>
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
