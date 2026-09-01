import { Metadata } from "next"
import { constructMetadata } from "@lib/util/seo"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import FeaturedCategories from "@modules/home/components/featured-categories"
import BrandStory from "@modules/home/components/brand-story"
import NewsletterSection from "@modules/home/components/newsletter-section"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode } = await props.params

  return constructMetadata({
    title: "London Boy | Modern British Clothing Tailored for Bangladesh",
    description:
      "Refined British smart-casual clothing crafted with 240 GSM combed cotton and tailored for Bangladesh. Fast Dhaka delivery and 24h returns.",
    canonical: `/${countryCode}`,
  })
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!region) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedCategories />
      {collections && collections.length > 0 && (
        <div className="py-12 bg-white">
          <ul className="flex flex-col gap-y-8">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      )}
      <BrandStory />
      <NewsletterSection />
    </div>
  )
}
