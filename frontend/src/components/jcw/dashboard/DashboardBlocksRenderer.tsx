"use client";

import Link from "next/link";
import type { DashboardTemplate, DashboardBlock } from "@/lib/api-types";

interface DashboardBlocksRendererProps {
  template: DashboardTemplate;
}

export function DashboardBlocksRenderer({ template }: DashboardBlocksRendererProps) {
  const activeBlocks = template.blocks.filter((b) => b.is_active);

  const mainBlocks = activeBlocks.filter((b) => b.region === "main");
  const sidebarBlocks = activeBlocks.filter((b) => b.region === "sidebar");

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        {mainBlocks.map((block) => (
          <DashboardBlockCard key={block.id} block={block} />
        ))}
      </div>

      <div className="space-y-4">
        {sidebarBlocks.map((block) => (
          <DashboardBlockCard key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}

interface DashboardBlockCardProps {
  block: DashboardBlock;
}

function DashboardBlockCard({ block }: DashboardBlockCardProps) {
  // Simple registry per block key. Add more as needed.
  if (block.key === "live-preview") {
    return <LivePreviewBlock block={block} />;
  }

  if (block.key === "next-steps") {
    return <NextStepsBlock block={block} />;
  }

  if (block.key === "quick-links") {
    return <QuickLinksBlock block={block} />;
  }

  // Fallback generic card for unknown keys
  return (
    <div className="rounded-xl border bg-card p-4 text-sm">
      <div className="font-medium">{block.title}</div>
      {block.description && (
        <p className="mt-1 text-xs text-muted-foreground">
          {block.description}
        </p>
      )}
    </div>
  );
}

function LivePreviewBlock({ block }: { block: DashboardBlock }) {
  return (
    <div className="rounded-xl border bg-card p-4 text-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="font-medium">{block.title}</div>
          {block.description && (
            <p className="mt-1 text-xs text-muted-foreground">
              {block.description}
            </p>
          )}
        </div>
        {block.target_route && (
          <Link
            href={block.target_route}
            className="text-xs font-medium text-primary hover:underline"
          >
            Open builder
          </Link>
        )}
      </div>

      <div className="mt-3 flex h-32 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
        Preview placeholder
      </div>
    </div>
  );
}

function NextStepsBlock({ block }: { block: DashboardBlock }) {
  return (
    <div className="rounded-xl border bg-card p-4 text-sm">
      <div className="font-medium">{block.title}</div>
      {block.description && (
        <p className="mt-1 text-xs text-muted-foreground">
          {block.description}
        </p>
      )}
      <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
        <li>Set up your website content in the builder.</li>
        <li>Choose your printing materials.</li>
        <li>Review everything and publish your site.</li>
      </ul>
    </div>
  );
}

function QuickLinksBlock({ block }: { block: DashboardBlock }) {
  const links = [
    { href: "/dashboard/website", label: "Website builder" },
    { href: "/dashboard/printing", label: "Printing & cards" },
    { href: "/dashboard/settings", label: "Project settings" },
  ];

  return (
    <div className="rounded-xl border bg-card p-4 text-sm">
      <div className="font-medium">{block.title}</div>
      {block.description && (
        <p className="mt-1 text-xs text-muted-foreground">
          {block.description}
        </p>
      )}
      <div className="mt-3 flex flex-col gap-2 text-xs">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-accent"
          >
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}