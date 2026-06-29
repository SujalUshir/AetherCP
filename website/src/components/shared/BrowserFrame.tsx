import { cn } from "@/lib/utils";

interface BrowserFrameProps {
  children: React.ReactNode;
  url?: string;
  className?: string;
  contentClassName?: string;
  size?: "sm" | "md" | "lg";
}

export function BrowserFrame({
  children,
  url = "codeforces.com",
  className,
  contentClassName,
  size = "md",
}: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/5 bg-card shadow-xl shadow-black/15 transition-all duration-300 hover:shadow-black/20",
        className
      )}
    >
      {/* Chrome bar */}
      <div className="flex items-center gap-3 border-b border-white/5 bg-card/65 px-4 py-3">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5" aria-hidden>
          <div className="h-2.5 w-2.5 rounded-full bg-[#E57373]/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#FFD54F]/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#81C784]/80" />
        </div>

        {/* Address bar */}
        <div className="flex flex-1 items-center gap-2 rounded bg-background/50 px-3 py-1">
          <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full border border-primary/30">
            <div className="h-1 w-1 rounded-full bg-primary/80" />
          </div>
          <span className="select-none text-[10px] text-muted-foreground/60 truncate">{url}</span>
        </div>

        {/* Window controls placeholder */}
        <div className="flex items-center gap-1.5" aria-hidden>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-1 w-1 rounded-full bg-white/10" />
          ))}
        </div>
      </div>

      {/* Content area */}
      <div
        className={cn(
          "flex items-center justify-center",
          size === "sm" && "p-4",
          size === "md" && "p-6 sm:p-8",
          size === "lg" && "p-8 sm:p-12",
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
