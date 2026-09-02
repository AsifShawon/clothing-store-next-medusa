"use client"

import React, { useState, useEffect } from "react"
import { XMark, InformationCircleSolid } from "@medusajs/icons"

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  productCategory?: string
}

export function SizeGuideModal({ isOpen, onClose, productCategory }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"in" | "cm">("in")

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isBottoms = productCategory?.toLowerCase().includes("trousers") || productCategory?.toLowerCase().includes("chinos")

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Size Guide"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl border border-brand-border z-10 overflow-hidden max-h-[90vh] flex flex-col animate-enter">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-brand-border flex items-center justify-between bg-brand-secondary/40">
          <div>
            <h3 className="font-display text-xl text-brand-primary">British Tailoring Size Guide</h3>
            <p className="text-xs text-grey-50 mt-0.5">
              Standard fit measurements calibrated for contemporary comfort in Bangladesh.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-grey-50 hover:text-brand-primary rounded hover:bg-black/5"
            aria-label="Close size guide"
          >
            <XMark className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-surface">
          <div className="flex items-center gap-2 text-xs text-grey-60">
            <InformationCircleSolid className="w-4 h-4 text-brand-accent" />
            <span>Measurements refer to garment dimensions when laid flat.</span>
          </div>
          <div className="flex items-center border border-brand-border bg-white text-xs font-semibold">
            <button
              type="button"
              onClick={() => setUnit("in")}
              className={`px-3 py-1 transition-colors ${
                unit === "in" ? "bg-brand-primary text-white" : "text-grey-60 hover:text-brand-primary"
              }`}
            >
              Inches (&quot;)
            </button>
            <button
              type="button"
              onClick={() => setUnit("cm")}
              className={`px-3 py-1 transition-colors ${
                unit === "cm" ? "bg-brand-primary text-white" : "text-grey-60 hover:text-brand-primary"
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Tables Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Tops Sizing Table */}
          {!isBottoms && (
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider">
                Shirts, T-Shirts & Polos (Men & Unisex)
              </h4>
              <div className="overflow-x-auto border border-brand-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-secondary border-b border-brand-border text-brand-primary font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Chest Width</th>
                      <th className="py-2.5 px-3">Body Length</th>
                      <th className="py-2.5 px-3">Shoulder</th>
                      <th className="py-2.5 px-3">Sleeve Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border text-grey-70 font-mono">
                    <tr className="hover:bg-brand-surface">
                      <td className="py-2.5 px-3 font-sans font-bold text-brand-primary">S (Small)</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '38"' : "96.5 cm"}</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '27.5"' : "70 cm"}</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '17.5"' : "44.5 cm"}</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '8.5"' : "21.5 cm"}</td>
                    </tr>
                    <tr className="hover:bg-brand-surface">
                      <td className="py-2.5 px-3 font-sans font-bold text-brand-primary">M (Medium)</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '40"' : "101.5 cm"}</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '28.5"' : "72.5 cm"}</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '18.5"' : "47 cm"}</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '9.0"' : "23 cm"}</td>
                    </tr>
                    <tr className="hover:bg-brand-surface">
                      <td className="py-2.5 px-3 font-sans font-bold text-brand-primary">L (Large)</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '42"' : "106.5 cm"}</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '29.5"' : "75 cm"}</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '19.5"' : "49.5 cm"}</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '9.5"' : "24 cm"}</td>
                    </tr>
                    <tr className="hover:bg-brand-surface">
                      <td className="py-2.5 px-3 font-sans font-bold text-brand-primary">XL (Extra Large)</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '44"' : "112 cm"}</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '30.5"' : "77.5 cm"}</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '20.5"' : "52 cm"}</td>
                      <td className="py-2.5 px-3">{unit === "in" ? '10.0"' : "25.5 cm"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bottoms Sizing Table */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider">
              Tailored Chinos & Trousers
            </h4>
            <div className="overflow-x-auto border border-brand-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-secondary border-b border-brand-border text-brand-primary font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Waist Size</th>
                    <th className="py-2.5 px-3">Actual Waist</th>
                    <th className="py-2.5 px-3">Hip Circumference</th>
                    <th className="py-2.5 px-3">Inseam Length</th>
                    <th className="py-2.5 px-3">Leg Opening</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-grey-70 font-mono">
                  <tr className="hover:bg-brand-surface">
                    <td className="py-2.5 px-3 font-sans font-bold text-brand-primary">30</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '31"' : "78.5 cm"}</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '38"' : "96.5 cm"}</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '30"' : "76 cm"}</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '13.5"' : "34 cm"}</td>
                  </tr>
                  <tr className="hover:bg-brand-surface">
                    <td className="py-2.5 px-3 font-sans font-bold text-brand-primary">32</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '33"' : "84 cm"}</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '40"' : "101.5 cm"}</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '31"' : "78.5 cm"}</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '14.0"' : "35.5 cm"}</td>
                  </tr>
                  <tr className="hover:bg-brand-surface">
                    <td className="py-2.5 px-3 font-sans font-bold text-brand-primary">34</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '35"' : "89 cm"}</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '42"' : "106.5 cm"}</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '31"' : "78.5 cm"}</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '14.5"' : "37 cm"}</td>
                  </tr>
                  <tr className="hover:bg-brand-surface">
                    <td className="py-2.5 px-3 font-sans font-bold text-brand-primary">36</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '37"' : "94 cm"}</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '44"' : "112 cm"}</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '32"' : "81 cm"}</td>
                    <td className="py-2.5 px-3">{unit === "in" ? '15.0"' : "38 cm"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Fit Guarantee Callout */}
          <div className="p-3.5 bg-brand-accent/5 border border-brand-accent/20 text-xs text-brand-primary space-y-1">
            <span className="font-bold block text-brand-accent">24-Hour Size Exchange Policy</span>
            <p className="text-grey-70">
              Need a different fit? We offer seamless size exchanges within Dhaka inside 24 hours of delivery.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-brand-secondary border-t border-brand-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  )
}
