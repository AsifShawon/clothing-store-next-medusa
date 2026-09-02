"use client"

import React, { useRef, useEffect } from "react"
import { Modal } from "../ui/modal"
import { MagnifyingGlassIcon, XMarkIcon } from "../icons"

export interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  query: string
  onQueryChange: (query: string) => void
  onSubmit?: (e: React.FormEvent) => void
  placeholder?: string
  suggestions?: string[]
  onSelectSuggestion?: (s: string) => void
  resultsSlot?: React.ReactNode
}

export function SearchModal({
  isOpen,
  onClose,
  query,
  onQueryChange,
  onSubmit,
  placeholder = "Search garments, fabrics (e.g. T-Shirt, Oxford, Linen, Chino)...",
  suggestions = ["Heavyweight T-Shirt", "Oxford Shirt", "Regent Polo", "Mayfair Chinos", "Linen Shirt", "Cotton Cap"],
  onSelectSuggestion,
  resultsSlot,
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(e)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Search Catalog"
      maxWidth="2xl"
    >
      <div className="space-y-5">
        <form onSubmit={handleSubmit} className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-brand-primary/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-11 pr-10 py-3 bg-brand-surface border border-brand-border text-xs text-brand-primary placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-primary transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-40 hover:text-brand-primary"
              aria-label="Clear search input"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Quick Suggestions */}
        {!query && suggestions && suggestions.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-brand-primary/60 block">
              Suggested Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    onQueryChange(s)
                    if (onSelectSuggestion) onSelectSuggestion(s)
                  }}
                  className="px-3 py-1.5 bg-brand-secondary/80 hover:bg-brand-primary hover:text-white border border-brand-border/60 text-xs text-brand-primary font-medium transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Slot */}
        {resultsSlot}
      </div>
    </Modal>
  )
}
