"use client"

import React, { useState } from "react"
import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import Spinner from "@modules/common/icons/spinner"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { promotions = [] } = cart

  const removePromotionCode = async (promoCode: string) => {
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== promoCode
    )

    try {
      await applyPromotions(
        validPromotions.filter((p) => p.code !== undefined).map((p) => p.code!)
      )
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error removing promotion code.")
    } finally {
      setIsLoading(false)
    }
  }

  const addPromotionCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const trimmed = code.trim().toUpperCase()
    const codes = promotions
      .filter((p) => p.code !== undefined)
      .map((p) => p.code!)
    codes.push(trimmed)

    try {
      await applyPromotions(codes)
      setCode("")
      setSuccessMessage(`Promo code "${trimmed}" applied successfully!`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid promotion code."
      setErrorMessage(msg.includes("not valid") || msg.includes("not found") ? "Invalid or expired promotion code." : msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full text-xs">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          type="button"
          className="text-xs font-heading font-semibold text-brand-primary hover:text-brand-accent underline underline-offset-4 flex items-center gap-1.5 transition-colors"
          data-testid="add-discount-button"
        >
          <span>🏷️ Have a promotion or gift voucher?</span>
        </button>
      ) : (
        <form onSubmit={addPromotionCode} className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="promotion-input" className="font-heading font-semibold text-[11px] uppercase tracking-wider text-brand-primary">
              Promotion Code
            </label>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setErrorMessage(null)
              }}
              className="text-[11px] text-brand-primary/60 hover:text-brand-primary"
            >
              Cancel
            </button>
          </div>

          <div className="flex gap-2">
            <input
              id="promotion-input"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., LONDON10"
              disabled={isLoading}
              data-testid="discount-input"
              className="flex-1 px-3 py-2 bg-white border border-brand-border text-brand-primary text-xs uppercase placeholder:normal-case placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-primary"
            />
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              data-testid="discount-apply-button"
              className="px-4 py-2 bg-brand-primary hover:bg-black text-white text-xs font-heading font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {isLoading && <Spinner className="animate-spin text-white" />}
              <span>Apply</span>
            </button>
          </div>

          {errorMessage && (
            <div
              className="p-2 bg-red-50 border border-brand-accent-alt/30 text-brand-accent-alt text-[11px] font-medium"
              data-testid="discount-error-message"
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-2 bg-green-50 border border-brand-accent/30 text-brand-accent text-[11px] font-medium">
              {successMessage}
            </div>
          )}
        </form>
      )}

      {/* Applied Promotions List */}
      {promotions.length > 0 && (
        <div className="mt-3 space-y-2 pt-2 border-t border-brand-border/40">
          <span className="text-[10px] font-heading font-semibold uppercase tracking-widest text-brand-accent block">
            Applied Promotions
          </span>

          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="flex items-center justify-between p-2 bg-brand-secondary border border-brand-border"
              data-testid="discount-row"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-brand-primary text-white text-[10px] font-mono font-bold" data-testid="discount-code">
                  {promotion.code}
                </span>
                {promotion.application_method?.value !== undefined && (
                  <span className="text-xs text-brand-primary font-medium">
                    {promotion.application_method.type === "percentage"
                      ? `(${promotion.application_method.value}% off)`
                      : `(-${convertToLocale({
                          amount: +promotion.application_method.value,
                          currency_code: cart.currency_code,
                        })})`}
                  </span>
                )}
              </div>

              {!promotion.is_automatic && (
                <button
                  type="button"
                  onClick={() => promotion.code && removePromotionCode(promotion.code)}
                  disabled={isLoading}
                  data-testid="remove-discount-button"
                  className="text-brand-primary/60 hover:text-brand-accent-alt transition-colors p-1"
                  aria-label="Remove promotion"
                >
                  <Trash size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DiscountCode
