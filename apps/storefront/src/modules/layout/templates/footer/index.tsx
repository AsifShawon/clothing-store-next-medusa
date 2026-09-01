import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })
  const productCategories = await listCategories()

  return (
    <footer className="bg-brand-primary text-brand-secondary border-t border-white/10 w-full">
      {/* Upper Trust Strip */}
      <div className="border-b border-white/10 py-6 bg-black/40">
        <div className="content-container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-1.5 p-2">
            <span className="text-lg">🚚</span>
            <h4 className="text-xs font-semibold font-heading uppercase tracking-wider text-white">
              Fast Dhaka Delivery
            </h4>
            <p className="text-[11px] text-brand-muted/80">Inside Dhaka in 24–48h for ৳60</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <span className="text-lg">🛡️</span>
            <h4 className="text-xs font-semibold font-heading uppercase tracking-wider text-white">
              24-Hour Returns
            </h4>
            <p className="text-[11px] text-brand-muted/80">Hassle-free size &amp; style exchange</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <span className="text-lg">🧵</span>
            <h4 className="text-xs font-semibold font-heading uppercase tracking-wider text-white">
              240 GSM Dense Cotton
            </h4>
            <p className="text-[11px] text-brand-muted/80">Structured drape &amp; French linen</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <span className="text-lg">💳</span>
            <h4 className="text-xs font-semibold font-heading uppercase tracking-wider text-white">
              Cash on Delivery &amp; Card
            </h4>
            <p className="text-[11px] text-brand-muted/80">Pay upon delivery or secure checkout</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="content-container py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <LocalizedClientLink href="/" className="inline-block">
              <span className="font-display text-2xl tracking-[0.2em] text-white font-bold">
                LONDON BOY
              </span>
            </LocalizedClientLink>
            <p className="text-xs text-brand-muted leading-relaxed max-w-sm">
              Modern British-inspired, confident, minimal and premium-accessible smart-casual clothing.
              Engineered with 240 GSM combed compact cotton and French linen, tailored for modern living in Bangladesh.
            </p>
            <div className="space-y-1.5 text-xs text-brand-muted/90 pt-2">
              <p>📍 Tejgaon Industrial Area, Dhaka, Bangladesh</p>
              <p>
                ✉️ Support:{" "}
                <a href="mailto:londonboy@mack.com.bd" className="text-white hover:underline">
                  londonboy@mack.com.bd
                </a>
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold tracking-widest uppercase text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li>
                <LocalizedClientLink href="/store" className="hover:text-white transition-colors">
                  All Clothing
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/categories/men" className="hover:text-white transition-colors">
                  Men&apos;s Collection
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/categories/women" className="hover:text-white transition-colors">
                  Women&apos;s Edit
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/categories/accessories" className="hover:text-white transition-colors">
                  Caps &amp; Accessories
                </LocalizedClientLink>
              </li>
              {productCategories?.slice(0, 3).map((cat) => (
                <li key={cat.id}>
                  <LocalizedClientLink href={`/categories/${cat.handle}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold tracking-widest uppercase text-white">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li>
                <LocalizedClientLink href="/collections/new-arrivals" className="hover:text-white transition-colors">
                  New Arrivals
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/collections/best-sellers" className="hover:text-white transition-colors">
                  Best Sellers
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/collections/essentials" className="hover:text-white transition-colors">
                  The Essentials Edit
                </LocalizedClientLink>
              </li>
              {collections?.map((col) => (
                <li key={col.id}>
                  <LocalizedClientLink href={`/collections/${col.handle}`} className="hover:text-white transition-colors">
                    {col.title}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold tracking-widest uppercase text-white">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li>
                <LocalizedClientLink href="/size-guide" className="hover:text-white transition-colors">
                  Size &amp; Fit Guide
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions (FAQ)
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/about" className="hover:text-white transition-colors">
                  About London Boy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping &amp; Delivery Rates
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/return-policy" className="hover:text-white transition-colors">
                  24h Return Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <p>© {new Date().getFullYear()} London Boy (londonboy.uk). All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Currency: 🇧🇩 BDT (৳)</span>
            <span>•</span>
            <LocalizedClientLink href="/shipping-policy" className="hover:underline">
              Nationwide Delivery in BD
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
