import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    // Base layout & typography
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium",
    // Overflow for shimmer/ripple
    "overflow-hidden",
    // Ring & focus
    "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    // Disabled
    "disabled:pointer-events-none disabled:opacity-50",
    // Transition — all properties, smooth cubic-bezier
    "transition-all duration-200 ease-out",
    // Press: scale down slightly for tactile click feel
    "active:scale-[0.97] active:transition-none",
    // Cursor
    "cursor-pointer select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground shadow-sm",
          // Hover: lift + glow
          "hover:-translate-y-[2px] hover:shadow-[0_4px_16px_-4px_hsl(var(--primary)/0.35),0_2px_8px_-2px_hsl(var(--primary)/0.2)]",
          "hover:bg-primary/95",
          // Shimmer overlay via ::before (defined in globals.css)
          "btn-shimmer",
        ].join(" "),

        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:-translate-y-[2px] hover:shadow-md",

        outline: [
          "border border-border bg-transparent text-foreground",
          "hover:bg-white/5 hover:border-white/20 hover:text-foreground",
          "hover:-translate-y-[2px] hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)]",
        ].join(" "),

        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80 hover:-translate-y-[2px] hover:shadow-sm",
        ].join(" "),

        ghost: [
          "hover:bg-white/5 hover:text-foreground",
          "hover:-translate-y-[1px]",
        ].join(" "),

        link: "text-primary underline-offset-4 hover:underline",

        // Premium glass CTA
        glass: [
          "glass-card text-foreground",
          "hover:border-primary/40 hover:bg-primary/5",
          "hover:-translate-y-[2px] hover:shadow-[0_4px_20px_-6px_hsl(var(--primary)/0.2)]",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 py-2",
        sm:      "h-9 rounded-md px-3",
        lg:      "h-12 rounded-lg px-8 text-base",
        xl:      "h-14 rounded-xl px-10 text-base font-semibold",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
