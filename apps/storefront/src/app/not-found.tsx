import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404 - Page Not Found | London Boy",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-block px-3 py-1 bg-brand-secondary border border-brand-border text-[10px] font-heading font-semibold uppercase tracking-widest text-brand-accent">
          Error 404
        </div>

        <h1 className="font-display text-4xl sm:text-5xl text-brand-primary">
          Page Not Found
        </h1>

        <p className="text-xs sm:text-sm text-brand-primary/70 leading-relaxed">
          The page you tried to access does not exist.
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-brand-primary text-white text-xs font-heading font-semibold uppercase tracking-widest hover:bg-black transition-colors"
          >
            Return to Frontpage →
          </Link>
        </div>
      </div>
    </div>
  )
}
