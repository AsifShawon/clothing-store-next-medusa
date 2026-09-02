"use client"

import React, { useState, useEffect } from "react"
import { useDemoAdmin } from "@lib/demo-store-context"
import { ArrowPath, ExclamationCircle, XMark } from "@medusajs/icons"

interface ResetConfirmModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResetConfirmModal({ isOpen, onClose }: ResetConfirmModalProps) {
  const { resetStore } = useDemoAdmin()
  const [confirmPhrase, setConfirmPhrase] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      setConfirmPhrase("")
      setError("")
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault()
    if (confirmPhrase.trim() !== "RESET DEMO") {
      setError("Please type exactly 'RESET DEMO' to confirm reset.")
      return
    }

    resetStore()
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm Reset Demo Store"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white border border-rose-300 p-6 max-w-md w-full shadow-2xl space-y-4 z-10 animate-enter">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
            <ExclamationCircle className="w-5 h-5" />
            <span>Reset Demo Store State</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-grey-40 hover:text-brand-primary p-1 rounded"
            aria-label="Close dialog"
          >
            <XMark className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-grey-70 leading-relaxed">
          This action will delete all custom demo orders, products, variants, and customer edits in your browser’s localStorage, reverting back to the authentic 6-product, 38-variant London Boy seed catalog.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded space-y-1.5">
            <label className="text-[11px] font-bold text-rose-900 block">
              To proceed, please type <code className="bg-white px-1.5 py-0.5 border border-rose-300 text-rose-800 font-mono">RESET DEMO</code> below:
            </label>
            <input
              type="text"
              value={confirmPhrase}
              onChange={(e) => {
                setConfirmPhrase(e.target.value)
                setError("")
              }}
              placeholder="RESET DEMO"
              className="w-full px-3 py-2 bg-white border border-rose-300 text-xs font-mono font-bold text-rose-900 uppercase focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            {error && <p className="text-[11px] text-rose-600 font-semibold">{error}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-brand-border text-xs font-semibold text-grey-70 hover:bg-brand-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={confirmPhrase.trim() !== "RESET DEMO"}
              className={`px-4 py-2 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                confirmPhrase.trim() !== "RESET DEMO" ? "opacity-40 cursor-not-allowed" : "hover:bg-rose-700"
              }`}
            >
              <ArrowPath className="w-3.5 h-3.5" />
              <span>Confirm & Reset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
