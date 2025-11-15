import type { ReactNode } from "react";

type ShellProps = {
  children: ReactNode;
};

export function MarketingPageShell({ children }: ShellProps) {
  return <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">{children}</div>;
}

type HeroProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
};

export function MarketingHero({
  id,
  eyebrow,
  title,
  subtitle,
  center = false,
}: HeroProps) {
  return (
    <section
      id={id}
      className="border-b border-slate-200 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-50 dark:border-slate-800"
    >
      <div
        className={[
          "mx-auto max-w-5xl px-4 py-12 md:py-16",
          center ? "text-center" : "",
        ].join(" ")}
      >
        {eyebrow && (
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-[11px] font-medium text-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
            {eyebrow}
          </p>
        )}
        <h1 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className={`text-sm text-slate-200/90 ${center ? "mx-auto max-w-3xl" : ""}`}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

type SectionProps = {
  id?: string;
  children: ReactNode;
  muted?: boolean;
  wide?: boolean;
};

export function MarketingSection({
  id,
  children,
  muted = false,
  wide = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={[
        "border-b",
        muted
          ? "bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-850"
          : "bg-slate-100/80 border-slate-200 dark:bg-slate-950 dark:border-slate-850",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto px-4 py-10 md:py-14",
          wide ? "max-w-6xl" : "max-w-4xl",
        ].join(" ")}
      >
        {children}
      </div>
    </section>
  );
}
