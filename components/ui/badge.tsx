import clsx from "clsx";

const colors = {
  default: "bg-mist-100 text-mist-700",
  green: "bg-emerald-100 text-emerald-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
};

type BadgeProps = {
  color?: keyof typeof colors;
  className?: string;
  children: React.ReactNode;
};

export function Badge({ color = "default", className, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
}
