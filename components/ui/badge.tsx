import * as React from "react"

const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'success' | 'destructive' | 'warning' | 'outline' }>(
  ({ className, variant = "default", ...props }, ref) => {
    let variantClasses = "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent";
    
    if (variant === 'success') variantClasses = "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20";
    if (variant === 'destructive') variantClasses = "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20";
    if (variant === 'warning') variantClasses = "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20";
    if (variant === 'outline') variantClasses = "text-foreground border-border";

    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantClasses} ${className}`}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
