"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { createPortal } from "react-dom"
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

// Global scroll lock counter to prevent unlock flicker during overlay handoff
let activeScrollLocks = 0
let savedBodyOverflow = ""
let savedPaddingRight = ""

function lockScroll() {
  if (typeof document === "undefined") return
  if (activeScrollLocks === 0) {
    savedBodyOverflow = document.body.style.overflow
    savedPaddingRight = document.body.style.paddingRight

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    document.body.style.overflow = "hidden"
  }
  activeScrollLocks++
}

function unlockScroll() {
  if (typeof document === "undefined") return
  activeScrollLocks = Math.max(0, activeScrollLocks - 1)
  if (activeScrollLocks === 0) {
    document.body.style.overflow = savedBodyOverflow
    document.body.style.paddingRight = savedPaddingRight
  }
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
  const [isMounted, setIsMounted] = useState(isOpen)
  const [isClosing, setIsClosing] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const drawerPanelRef = useRef<HTMLDivElement>(null)
  const triggerElementRef = useRef<HTMLElement | null>(null)

  // Handle open/close state transitions with exit animation
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement | null
      setIsMounted(true)
      setIsClosing(false)
      lockScroll()
    } else if (isMounted && !isClosing) {
      // Check prefers-reduced-motion
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (prefersReduced) {
        setIsMounted(false)
        unlockScroll()
        triggerElementRef.current?.focus()
      } else {
        setIsClosing(true)
        const timer = setTimeout(() => {
          setIsMounted(false)
          setIsClosing(false)
          unlockScroll()
          triggerElementRef.current?.focus()
        }, 250)
        return () => clearTimeout(timer)
      }
    }
  }, [isOpen])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isOpen || isMounted) {
        unlockScroll()
      }
    }
  }, [])

  // Keyboard accessibility: Escape key and Focus Trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isMounted) return

      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === "Tab") {
        if (!drawerPanelRef.current) return
        const focusable = drawerPanelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [isMounted, onClose]
  )

  useEffect(() => {
    if (isMounted) {
      window.addEventListener("keydown", handleKeyDown)
      // Focus initial control
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 50)
      return () => {
        clearTimeout(timer)
        window.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [isMounted, handleKeyDown])

  if (!isMounted) return null

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || "Slide-over Drawer"}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300",
          isClosing ? "opacity-0" : "opacity-100 animate-fade-in"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        className={clsx(
          "fixed inset-y-0 flex max-w-full z-10",
          position === "right" ? "right-0" : "left-0"
        )}
      >
        <div
          ref={drawerPanelRef}
          className={clsx(
            "w-screen bg-[#FAFAF7] shadow-2xl flex flex-col h-full border-brand-border duration-300 ease-out",
            position === "right"
              ? isClosing
                ? "animate-drawer-exit border-l"
                : "animate-drawer-enter border-l"
              : isClosing
                ? "animate-fade-out border-r"
                : "animate-fade-in border-r",
            maxWidth === "sm" && "max-w-sm",
            maxWidth === "md" && "max-w-[420px] sm:max-w-[460px]",
            maxWidth === "lg" && "max-w-lg",
            className
          )}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-brand-border/80 flex items-center justify-between bg-white flex-shrink-0">
            <h2 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider">
              {title || ""}
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="p-2 -mr-1 text-brand-muted hover:text-brand-primary transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close drawer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col">{children}</div>
        </div>
      </div>
    </div>
  )

  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body)
  }
  return modalContent
}
