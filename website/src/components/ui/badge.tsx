import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "outline" | "accent" }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        variant === "default" && "bg-secondary text-secondary-foreground",
        variant === "outline" && "border border-border text-muted-foreground",
        variant === "accent" &&
          "bg-primary/10 text-primary border border-primary/20",
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
