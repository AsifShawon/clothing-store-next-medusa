import { HttpTypes } from "@medusajs/types"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const COLOR_MAP: Record<string, string> = {
  black: "#111111",
  white: "#FFFFFF",
  "sky blue": "#7EB6D9",
  "forest green": "#1E4937",
  "midnight navy": "#172554",
  khaki: "#C3B091",
  charcoal: "#374151",
  olive: "#556B2F",
  sand: "#D2B48C",
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)
  const isColor = title.toLowerCase().includes("color")

  return (
    <div className="flex flex-col gap-y-2.5">
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-heading font-semibold uppercase tracking-wider text-brand-primary">
          Select {title}:
        </span>
        {current && (
          <span className="font-medium text-brand-accent">{current}</span>
        )}
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label={`Select ${title}`}
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          const isSelected = v === current
          const colorHex = isColor ? COLOR_MAP[v.toLowerCase()] : undefined

          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${title} ${v}`}
              onClick={() => updateOption(option.id, v)}
              disabled={disabled}
              className={`min-w-[44px] h-10 px-3.5 flex items-center justify-center text-xs font-semibold uppercase tracking-wider transition-all duration-150 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 ${
                isSelected
                  ? "border-brand-primary bg-brand-primary text-white shadow-sm ring-1 ring-brand-primary"
                  : "border-brand-border bg-brand-card text-brand-primary hover:border-brand-primary/60 hover:bg-white"
              } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              data-testid="option-button"
            >
              {colorHex && (
                <span
                  className="w-3 h-3 rounded-full mr-2 border border-black/20"
                  style={{ backgroundColor: colorHex }}
                  aria-hidden="true"
                />
              )}
              <span>{v}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
