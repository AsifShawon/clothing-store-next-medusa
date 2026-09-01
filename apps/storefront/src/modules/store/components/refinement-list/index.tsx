"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState, useEffect } from "react"
import {
  OPTION_VALUE_QUERY_KEY,
  parseOptionValueIds,
} from "@lib/util/product-option-filters"
import OptionsPicker from "./options-picker"
import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  hideOptionsPicker?: boolean
  "data-testid"?: string
}

const RefinementList = ({
  sortBy,
  hideOptionsPicker = false,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get("q") || ""
  const [searchInput, setSearchInput] = useState(currentSearch)

  useEffect(() => {
    setSearchInput(currentSearch)
  }, [currentSearch])

  const updateQueryParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      updater(params)

      params.delete("page")

      const queryString = params.toString()
      const currentQuery = searchParams.toString()
      const nextPath = queryString ? `${pathname}?${queryString}` : pathname
      const currentPath = currentQuery
        ? `${pathname}?${currentQuery}`
        : pathname

      if (nextPath !== currentPath) {
        router.push(nextPath)
      }
    },
    [pathname, router, searchParams]
  )

  const setQueryParams = (name: string, value: string) =>
    updateQueryParams((params) => params.set(name, value))

  const selectedOptionValueIds = useMemo(
    () => parseOptionValueIds(searchParams),
    [searchParams]
  )

  const setOptionValueIds = (valueIds: string[]) =>
    updateQueryParams((params) => {
      params.delete(OPTION_VALUE_QUERY_KEY)
      valueIds.forEach((valueId) =>
        params.append(OPTION_VALUE_QUERY_KEY, valueId)
      )
    })

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateQueryParams((params) => {
      if (searchInput.trim()) {
        params.set("q", searchInput.trim())
      } else {
        params.delete("q")
      }
    })
  }

  const handleClearAll = () => {
    router.push(pathname)
  }

  const hasFilters = Boolean(
    currentSearch ||
    selectedOptionValueIds.length > 0 ||
    searchParams.get("sortBy")
  )

  return (
    <div className="flex flex-col gap-6 py-2 mb-8 w-full small:max-w-[260px] small:mr-8 border-b small:border-b-0 small:border-r border-brand-border/60 pr-0 small:pr-6">
      {/* Keyword Search In Catalog */}
      <div className="space-y-2">
        <span className="font-heading text-xs font-bold uppercase tracking-wider text-brand-primary block">
          Search Clothing
        </span>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search shirts, tees, polos..."
            className="w-full px-3 py-2 text-xs border border-brand-border bg-white text-brand-primary placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-primary"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary/60 hover:text-brand-primary text-xs font-bold"
            aria-label="Search"
          >
            →
          </button>
        </form>
        {currentSearch && (
          <div className="flex items-center justify-between text-[11px] text-brand-accent">
            <span>Query: &quot;{currentSearch}&quot;</span>
            <button
              onClick={() => {
                setSearchInput("")
                updateQueryParams((p) => p.delete("q"))
              }}
              className="hover:underline text-brand-accent-alt"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Sorting */}
      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />

      {/* Options Picker (Sizes, Colors, etc.) */}
      {!hideOptionsPicker && (
        <OptionsPicker
          selectedValueIds={selectedOptionValueIds}
          setOptionValueIds={setOptionValueIds}
        />
      )}

      {/* Clear All Filters Button */}
      {hasFilters && (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleClearAll}
            className="w-full py-2 bg-brand-secondary hover:bg-brand-primary hover:text-white border border-brand-border text-xs font-heading font-semibold uppercase tracking-wider transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default RefinementList
