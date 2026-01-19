"use client";

import * as Headless from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, { forwardRef } from "react";

type SelectProps = {
  className?: string;
} & Omit<Headless.SelectProps, "as" | "className">;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, ...props }, ref) {
    return (
      <span
        data-slot="control"
        className={clsx([
          className,
          "group relative block w-full",
          "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow",
          "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent",
          "focus-within:after:ring-2 focus-within:after:ring-mist-500",
          "has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-mist-100 before:has-[[data-disabled]]:shadow-none",
        ])}
      >
        <Headless.Select
          ref={ref}
          {...props}
          className={clsx([
            "relative block w-full appearance-none rounded-lg py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
            "pl-[calc(theme(spacing[3.5])-1px)] pr-[calc(theme(spacing.10)-1px)] sm:pl-[calc(theme(spacing.3)-1px)] sm:pr-[calc(theme(spacing.9)-1px)]",
            "text-base/6 text-mist-900 placeholder:text-mist-400 sm:text-sm/6",
            "border border-mist-300 data-[hover]:border-mist-400",
            "bg-transparent",
            "focus:outline-none",
            "*:text-black",
          ])}
        />
        <ChevronDownIcon
          className="pointer-events-none absolute right-2.5 top-1/2 size-5 -translate-y-1/2 text-mist-400 group-has-[[data-disabled]]:text-mist-200"
          aria-hidden="true"
        />
      </span>
    );
  }
);
