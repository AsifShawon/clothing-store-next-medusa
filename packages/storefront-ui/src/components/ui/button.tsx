import React, { forwardRef, ButtonHTMLAttributes } from "react"
import clsx from "clsx"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "contrast" | "outline" | "ghost" | "danger"
  size?: "small" | "medium" | "large"
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "medium",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          "inline-flex items-center justify-center font-heading font-semibold uppercase tracking-wider transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "primary" && "bg-brand-primary text-white hover:bg-black border border-brand-primary",
          variant === "secondary" && "bg-brand-secondary text-brand-primary hover:bg-brand-muted/40 border border-brand-border",
          variant === "contrast" && "bg-brand-primary text-white hover:bg-brand-primary/90 border border-brand-primary",
          variant === "outline" && "bg-transparent text-brand-primary hover:bg-brand-secondary border border-brand-border hover:border-brand-primary",
          variant === "ghost" && "bg-transparent text-brand-primary hover:bg-brand-secondary/70 border-transparent",
          variant === "danger" && "bg-rose-700 text-white hover:bg-rose-800 border border-rose-700",
          size === "small" && "h-8 px-3 text-[11px]",
          size === "medium" && "h-10 px-5 text-xs",
          size === "large" && "h-12 px-8 text-xs sm:text-sm",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = "Button"
