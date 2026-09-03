import React, { HTMLAttributes } from "react"
import clsx from "clsx"

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "accent" | "secondary" | "danger" | "warning" | "outline"
}

export function Badge({
  className,
  variant = "brand",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-heading font-semibold uppercase tracking-wider",
        variant === "brand" && "bg-brand-primary text-white",
        variant === "accent" && "bg-brand-accent text-white",
        variant === "secondary" && "bg-brand-secondary text-brand-accent border border-brand-muted/40",
        variant === "danger" && "bg-rose-900 text-white",
        variant === "warning" && "bg-amber-800 text-white",
        variant === "outline" && "bg-transparent text-brand-primary border border-brand-border",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
