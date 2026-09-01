import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "404 - Page Not Found | London Boy",
  description: "The page you are looking for does not exist in the London Boy clothing store.",
}

export default function NotFound() {
  return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-block px-3 py-1 bg-brand-secondary border border-brand-border text-[10px] font-heading font-semibold uppercase tracking-widest text-brand-accent">
          Error 404
        </div>

        <h1 className="font-display text-4xl sm:text-5xl text-brand-primary">
          Page Not Found
        </h1>

        <p className="text-xs sm:text-sm text-brand-primary/70 leading-relaxed">
          The clothing piece or page you are looking for might have been moved, renamed, or is temporarily unavailable in our Dhaka catalog.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <LocalizedClientLink
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-brand-primary text-white text-xs font-heading font-semibold uppercase tracking-widest hover:bg-black transition-colors"
          >
            Return to Home
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/store"
            className="w-full sm:w-auto px-6 py-3 bg-brand-secondary border border-brand-border text-brand-primary text-xs font-heading font-semibold uppercase tracking-widest hover:bg-white transition-colors"
          >
            Explore Catalog
          </LocalizedClientLink>
        </div>

        <div className="pt-8 border-t border-brand-border/60 text-xs text-brand-primary/60 space-y-2">
          <span className="font-semibold uppercase tracking-wider block">Popular Categories</span>
          <div className="flex flex-wrap justify-center gap-2">
            <LocalizedClientLink href="/collections/new-arrivals" className="hover:underline">
              New Arrivals
            </LocalizedClientLink>
            <span>•</span>
            <LocalizedClientLink href="/collections/essentials" className="hover:underline">
              The Essentials
            </LocalizedClientLink>
            <span>•</span>
            <LocalizedClientLink href="/contact" className="hover:underline">
              Contact Support
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}
