import { HttpTypes } from "@medusajs/types"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  if (!variant) {
    return null
  }

  const sku = variant.sku
  const options = variant.options || []

  return (
    <div
      data-testid={dataTestid}
      data-value={dataValue}
      className="flex flex-col gap-1 text-xs text-brand-primary/70 my-1"
    >
      {/* Options Chips (Size, Color, etc.) */}
      {options.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {options.map((option) => (
            <span
              key={option.id || option.value}
              className="inline-flex items-center px-2 py-0.5 bg-brand-secondary text-brand-primary text-[10px] font-heading font-semibold uppercase tracking-wider border border-brand-border/60"
            >
              {option.value}
            </span>
          ))}
        </div>
      ) : variant.title ? (
        <span className="inline-flex items-center px-2 py-0.5 bg-brand-secondary text-brand-primary text-[10px] font-heading font-semibold uppercase tracking-wider border border-brand-border/60 w-fit">
          {variant.title}
        </span>
      ) : null}

      {/* SKU Tag */}
      {sku && (
        <span className="text-[10px] font-mono text-brand-muted tracking-tight">
          SKU: {sku}
        </span>
      )}
    </div>
  )
}

export default LineItemOptions
