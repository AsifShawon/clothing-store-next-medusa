import { ProductView } from "./catalog"

export interface SearchCategorySuggestion {
  name: string
  handle: string
  count?: number
}

export interface SearchStateContract {
  query: string
  isSearching: boolean
  products: ProductView[]
  totalCount: number
  querySuggestions: string[]
  categorySuggestions: SearchCategorySuggestion[]
}
