import { cn } from "@/lib/utils";

interface EnhancedSurnameCardProps {
  label: string;
  value: string;
  color: "blue" | "green" | "purple" | "yellow" | "red" | "amber";
  icon?: string;
  customClass?: string;
}

const colorClasses = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
  yellow: {
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
};

export function EnhancedSurnameCard({
  label,
  value,
  color,
  icon,
  customClass,
}: EnhancedSurnameCardProps) {
  const classes = colorClasses[color];

  return (
    <div
      className={cn(
        "p-5 rounded-xl border transition-all hover:shadow-md",
        classes.bg,
        classes.border,
      )}
    >
      <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </div>
      <div
        className={cn(
          "text-2xl md:text-3xl font-bold",
          classes.text,
          customClass,
        )}
      >
        {icon && <span className="mr-1 text-lg opacity-50">{icon}</span>}
        {value}
      </div>
    </div>
  );
}
