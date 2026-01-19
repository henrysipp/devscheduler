import clsx from "clsx";

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">;

export function Heading({ level = 1, className, ...props }: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;

  return (
    <Element
      {...props}
      className={clsx(
        className,
        "text-2xl/8 font-semibold text-mist-900 sm:text-xl/8"
      )}
    />
  );
}

export function Subheading({
  level = 2,
  className,
  ...props
}: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;

  return (
    <Element
      {...props}
      className={clsx(
        className,
        "text-base/7 font-semibold text-mist-900 sm:text-sm/6"
      )}
    />
  );
}
