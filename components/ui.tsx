import type { ReactNode } from "react";

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`bg-white rounded-3xl border border-neutral-100 shadow-[0_2px_24px_-8px_rgba(0,0,0,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}

const badgeTones = {
  orange: "bg-orange-100 text-orange-600",
  green: "bg-emerald-100 text-emerald-600",
  neutral: "bg-neutral-100 text-neutral-500",
} as const;

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof badgeTones;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-full text-xs font-semibold ${badgeTones[tone]}`}
    >
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="p-6">
      {icon && (
        <div className="w-11 h-11 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-500 mb-5">
          {icon}
        </div>
      )}
      <div className="text-sm text-neutral-500 mb-1">{label}</div>
      <div className="text-3xl font-bold text-neutral-900 tracking-tight">{value}</div>
      {delta && (
        <span className="inline-block mt-3 text-xs font-semibold text-emerald-600 bg-emerald-100 rounded-full px-2.5 py-1">
          {delta}
        </span>
      )}
    </Card>
  );
}
