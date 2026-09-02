import React, { forwardRef, InputHTMLAttributes } from "react"
import clsx from "clsx"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-heading font-semibold text-brand-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full px-3.5 py-2.5 bg-white border text-xs text-brand-primary placeholder:text-brand-muted/70 transition-colors focus:outline-none focus:border-brand-primary disabled:bg-grey-5 disabled:opacity-50",
            error ? "border-rose-600 focus:border-rose-600" : "border-brand-border",
            className
          )}
          {...props}
        />
        {error && <p className="text-[11px] text-rose-600 pl-0.5">{error}</p>}
        {helperText && !error && <p className="text-[11px] text-grey-50 pl-0.5">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"
