import React, { useEffect } from "react"
import clsx from "clsx"
import { XMarkIcon } from "../icons"

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  position?: "left" | "right"
  maxWidth?: "sm" | "md" | "lg"
  className?: string
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
  maxWidth = "md",
  className,
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || "Slide-over Drawer"}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        className={clsx(
          "fixed inset-y-0 flex max-w-full z-10",
          position === "right" ? "right-0 pl-10" : "left-0 pr-10"
        )}
      >
        <div
          className={clsx(
            "w-screen bg-white shadow-2xl flex flex-col h-full border-brand-border animate-fade-in",
            position === "right" ? "border-l" : "border-r",
            maxWidth === "sm" && "max-w-sm",
            maxWidth === "md" && "max-w-md",
            maxWidth === "lg" && "max-w-lg",
            className
          )}
        >
          <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-surface">
            <h2 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider">
              {title || ""}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-grey-40 hover:text-brand-primary transition-colors"
              aria-label="Close drawer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </div>
  )
}
