import * as React from "react"
import { Slot } from "@radix-ui/react-slot" // Wait, I don't have radix installed. I will use standard element.

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button"
    
    // Manual variant classes instead of cva to avoid dependency
    let variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90 shadow";
    if (variant === 'destructive') variantClasses = "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm";
    if (variant === 'outline') variantClasses = "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm";
    if (variant === 'secondary') variantClasses = "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm";
    if (variant === 'ghost') variantClasses = "hover:bg-accent hover:text-accent-foreground";
    if (variant === 'link') variantClasses = "text-primary underline-offset-4 hover:underline";
    
    let sizeClasses = "h-10 px-4 py-2";
    if (size === 'sm') sizeClasses = "h-9 rounded-md px-3 text-xs";
    if (size === 'lg') sizeClasses = "h-11 rounded-md px-8";
    if (size === 'icon') sizeClasses = "h-10 w-10";

    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95";

    return (
      <Comp
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
