"use client";

import * as Headless from "@headlessui/react";
import clsx from "clsx";
import React, { forwardRef } from "react";

const dateTypes = ["date", "datetime-local", "month", "time", "week"];

type InputProps = {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
} & Omit<Headless.InputProps, "as" | "className">;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...props },
  ref
) {
  return (
    <span
      data-slot="control"
      className={clsx([
        className,
        "relative block w-full",
        "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow",
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent",
        "focus-within:after:ring-2 focus-within:after:ring-mist-500",
        "has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-mist-100 before:has-[[data-disabled]]:shadow-none",
      ])}
    >
      <Headless.Input
        ref={ref}
        type={type}
        {...props}
        className={clsx([
          "relative block w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
          "text-base/6 text-mist-900 placeholder:text-mist-400 sm:text-sm/6",
          "border border-mist-300 data-[hover]:border-mist-400",
          "bg-transparent",
          "focus:outline-none",
          "data-[disabled]:border-mist-200",
          dateTypes.includes(type) && "[&::-webkit-datetime-edit-fields-wrapper]:p-0",
        ])}
      />
    </span>
  );
});
