import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("relative block opacity-[0.65]", {
  variants: {
    size: {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  loading?: boolean;
  asChild?: boolean;
}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, loading = true, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";

    const [bgColorClass, filteredClassName] = React.useMemo(() => {
      const bgClass = className?.match(/(?:dark:bg-|bg-)[a-zA-Z0-9-]+/g) ?? [];
      const filteredClasses = className
        ?.replace(/(?:dark:bg-|bg-)[a-zA-Z0-9-]+/g, "")
        .trim();
      return [bgClass, filteredClasses];
    }, [className]);

    if (!loading) return null;

    return (
      <Comp
        className={cn(spinnerVariants({ size, className: filteredClassName }))}
        ref={ref}
        {...props}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="animate-spinner-leaf-fade absolute top-0 left-1/2 h-full w-[12.5%]"
            style={{
              transform: `rotate(${i * 45}deg)`,
              animationDelay: `${-(7 - i) * 100}ms`,
            }}
          >
            <span
              className={cn("block h-[30%] w-full rounded-full", bgColorClass)}
            ></span>
          </span>
        ))}
      </Comp>
    );
  },
);

Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
