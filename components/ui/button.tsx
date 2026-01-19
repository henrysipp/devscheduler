"use client";

import * as Headless from "@headlessui/react";
import clsx from "clsx";
import React from "react";
import { Link } from "./link";

const styles = {
  base: [
    "relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border text-base/6 font-semibold",
    "px-[calc(theme(spacing.3)-1px)] py-[calc(theme(spacing[1.5])-1px)] sm:px-[calc(theme(spacing.4)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)] sm:text-sm/6",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mist-500",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ],
  solid: [
    "border-transparent bg-mist-800 text-white",
    "hover:bg-mist-700",
    "active:bg-mist-900",
  ],
  outline: [
    "border-mist-300 text-mist-700 bg-white",
    "hover:bg-mist-50",
    "active:bg-mist-100",
  ],
  plain: [
    "border-transparent text-mist-700",
    "hover:bg-mist-100",
    "active:bg-mist-200",
  ],
};

type ButtonProps = (
  | { color?: "solid" | "outline" | "plain"; href?: undefined }
  | { color?: "solid" | "outline" | "plain"; href: string }
) & {
  className?: string;
  children: React.ReactNode;
} & (
    | Omit<Headless.ButtonProps, "as" | "className">
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
  );

export function Button({
  color = "solid",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = clsx(className, styles.base, styles[color]);

  return "href" in props ? (
    <Link {...props} className={classes}>
      {children}
    </Link>
  ) : (
    <Headless.Button {...props} className={classes}>
      {children}
    </Headless.Button>
  );
}
