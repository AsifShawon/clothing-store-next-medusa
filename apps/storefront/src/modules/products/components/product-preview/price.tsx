import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <div className="flex items-baseline gap-2">
      {price.price_type === "sale" && (
        <span
          className="line-through text-xs text-brand-primary/40"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <span
        className={`text-sm font-bold font-sans ${
          price.price_type === "sale" ? "text-brand-accent-alt" : "text-brand-primary"
        }`}
        data-testid="price"
      >
        {price.calculated_price}
      </span>
    </div>
  )
}
