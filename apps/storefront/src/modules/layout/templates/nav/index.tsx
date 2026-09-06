import { Suspense } from "react"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import AnnouncementBar from "@modules/layout/components/announcement-bar"
import NavHeader from "@modules/layout/components/nav-header"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="relative z-40">
      <AnnouncementBar />
      <NavHeader
        regions={regions}
        locales={locales}
        currentLocale={currentLocale}
        cartCountNode={
          <Suspense
            fallback={
              <LocalizedClientLink
                className="hover:text-brand-accent flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-primary p-2"
                href="/cart"
                data-testid="nav-cart-link"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span>Bag (0)</span>
              </LocalizedClientLink>
            }
          >
            <CartButton />
          </Suspense>
        }
      />
    </div>
  )
}
