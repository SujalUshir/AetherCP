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
          // Hover: subtle lift + soft warm shadow
          "hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(139,79,41,0.22)]",
          "hover:bg-primary/95",
          // Shimmer overlay via ::before (defined in globals.css)
          "btn-shimmer",
        ].join(" "),

        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:-translate-y-[1px] hover:shadow-md",

        outline: [
          "border border-border bg-transparent text-foreground",
          "hover:bg-secondary/40 hover:border-border hover:text-foreground",
          "hover:-translate-y-[1px] hover:shadow-[0_3px_8px_rgba(139,79,41,0.12)]",
        ].join(" "),

        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80 hover:-translate-y-[1px]",
        ].join(" "),

        ghost: [
          "hover:bg-secondary/60 hover:text-foreground",
          "hover:-translate-y-[0.5px]",
        ].join(" "),

        link: "text-primary underline-offset-4 hover:underline",

        // Premium glass CTA
        glass: [
          "border border-border bg-background/50 backdrop-blur-md text-foreground",
          "hover:border-primary/20 hover:bg-primary/5",
          "hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(139,79,41,0.14)]",
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
