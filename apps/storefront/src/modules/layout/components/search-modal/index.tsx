"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"

type SearchModalProps = {
  isOpen: boolean
  onClose: () => void
}

const POPULAR_SEARCHES = [
  "Heavyweight T-Shirt",
  "Oxford Shirt",
  "Pique Polo",
  "Tailored Chinos",
  "Linen Shirt",
  "Cotton Cap",
]

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<HttpTypes.StoreProduct[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "bd"

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      setQuery("")
      setResults([])
    }
    return () => {
      document.body.style.overflow = ""
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

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

        const res = await fetch(
          `${backendUrl}/store/products?q=${encodeURIComponent(query.trim())}&limit=6`,
          {
            headers: {
              "x-publishable-api-key": publishableKey,
            },
          }
        )
        if (res.ok) {
          const data = await res.json()
          setResults(data.products || [])
        }
      } catch (err) {
        console.error("Search query error:", err)
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onClose()
      router.push(`/${countryCode}/store?q=${encodeURIComponent(query.trim())}`)
    }
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search catalog dialog"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in-top"
    >
      <div className="bg-white w-full max-w-2xl border border-brand-border shadow-2xl overflow-hidden rounded-none">
        {/* Header Search Input */}
        <form onSubmit={handleSubmit} className="relative flex items-center border-b border-brand-border px-4 py-3">
          <svg
            className="w-5 h-5 text-brand-primary/60 mr-3 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search London Boy clothing (e.g., T-Shirt, Oxford, Chinos)..."
            aria-label="Search query"
            className="w-full bg-transparent text-sm sm:text-base text-brand-primary placeholder:text-brand-muted/70 focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-brand-muted hover:text-brand-primary px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              aria-label="Clear search input"
            >
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="ml-2 p-1.5 text-brand-primary/60 hover:text-brand-primary hover:bg-brand-secondary text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            aria-label="Close search dialog"
          >
            ✕
          </button>
        </form>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-4" aria-live="polite">
          {loading && (
            <div className="py-8 text-center text-sm text-brand-primary/60 animate-pulse">
              Searching London Boy catalog...
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-brand-primary/60 uppercase tracking-wider">
                Matching Products ({results.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((product) => {
                  const minPrice = product.variants?.[0]?.calculated_price?.calculated_amount
                  const currencyCode = product.variants?.[0]?.calculated_price?.currency_code || "bdt"

                  return (
                    <LocalizedClientLink
                      key={product.id}
                      href={`/products/${product.handle}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-2.5 border border-brand-border/60 hover:border-brand-primary hover:bg-brand-secondary/40 transition-colors group"
                    >
                      <div className="relative w-14 h-18 bg-brand-secondary flex-shrink-0 overflow-hidden">
                        {product.thumbnail || product.images?.[0]?.url ? (
                          <Image
                            src={product.thumbnail || product.images?.[0]?.url || ""}
                            alt={product.title}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-brand-muted">
                            LB
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-brand-primary truncate group-hover:underline">
                          {product.title}
                        </h4>
                        <p className="text-[11px] text-brand-primary/60 truncate">
                          {product.subtitle || product.material || "British Smart-Casual"}
                        </p>
                        {minPrice && (
                          <p className="text-xs font-semibold text-brand-primary mt-1">
                            {convertToLocale({ amount: minPrice, currency_code: currencyCode })}
                          </p>
                        )}
                      </div>
                    </LocalizedClientLink>
                  )
                })}
              </div>
              <div className="pt-2 text-center">
                <button
                  onClick={handleSubmit}
                  className="text-xs font-medium text-brand-accent hover:underline uppercase tracking-wider"
                >
                  View all results for &quot;{query}&quot; →
                </button>
              </div>
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm font-medium text-brand-primary">No matching items found for &quot;{query}&quot;</p>
              <p className="text-xs text-brand-primary/60">
                Try searching for general terms like &quot;t-shirt&quot;, &quot;shirt&quot;, &quot;polo&quot;, or &quot;chinos&quot;.
              </p>
            </div>
          )}

          {/* Quick Search Chips */}
          {!query && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-brand-primary/60 uppercase tracking-wider">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="px-3 py-1.5 text-xs bg-brand-secondary hover:bg-brand-primary hover:text-white border border-brand-border transition-colors rounded-none"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-brand-border/60">
                <span className="text-xs font-semibold text-brand-primary/60 uppercase tracking-wider block mb-2">
                  Browse by Collection
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <LocalizedClientLink
                    href="/collections/new-arrivals"
                    onClick={onClose}
                    className="p-2 bg-brand-card hover:bg-brand-secondary transition-colors border border-brand-border/60 text-center font-medium"
                  >
                    New Arrivals
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/collections/best-sellers"
                    onClick={onClose}
                    className="p-2 bg-brand-card hover:bg-brand-secondary transition-colors border border-brand-border/60 text-center font-medium"
                  >
                    Best Sellers
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/collections/essentials"
                    onClick={onClose}
                    className="p-2 bg-brand-card hover:bg-brand-secondary transition-colors border border-brand-border/60 text-center font-medium"
                  >
                    The Essentials
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
