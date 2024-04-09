"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface LoadingSpinnerProps extends ComponentProps<"span"> {
  className?: string;
}

export function LoadingSpinner({ className, ...props }: LoadingSpinnerProps) {
  return (
    <span
      {...props}
      className={cn(
        "h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600",
        className,
      )}
    />
  );
}
