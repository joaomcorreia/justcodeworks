import type { ReactNode } from "react";
import { MarketingPageShell, MarketingHero, MarketingSection } from "@/components/marketing-layout";

type UtilityPageShellProps = {
  label: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function UtilityPageShell({
  label,
  title,
  description,
  children,
}: UtilityPageShellProps) {
  return (
    <MarketingPageShell>
      <MarketingHero
        id={`jcw-utilities-${title.toLowerCase().replace(/\s+/g, "-")}-hero`}
        eyebrow={label}
        title={title}
        subtitle={description}
      />
      <MarketingSection id={`jcw-utilities-${title.toLowerCase().replace(/\s+/g, "-")}-content`}>
        {children}
      </MarketingSection>
    </MarketingPageShell>
  );
}
