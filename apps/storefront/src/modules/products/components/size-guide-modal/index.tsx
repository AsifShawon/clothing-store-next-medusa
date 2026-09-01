"use client"

import { useState } from "react"

type SizeGuideModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<"tops" | "shirts" | "chinos">("tops")
  const [unit, setUnit] = useState<"in" | "cm">("in")

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-top"
    >
      <div className="bg-white w-full max-w-2xl border border-brand-border shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-border/80 pb-4">
          <div>
            <span className="text-[10px] font-heading font-semibold uppercase tracking-widest text-brand-accent">
              British Sizing Standard
            </span>
            <h3 id="size-guide-modal-title" className="font-display text-2xl text-brand-primary">
              London Boy Size &amp; Fit Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-brand-primary/60 hover:text-brand-primary text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            aria-label="Close size guide dialog"
          >
            ✕
          </button>
        </div>

        {/* Tab & Unit Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex border-b border-brand-border sm:border-b-0 gap-2" role="tablist" aria-label="Garment size tabs">
            <button
              role="tab"
              aria-selected={activeTab === "tops"}
              onClick={() => setActiveTab("tops")}
              className={`pb-2 text-xs font-heading font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                activeTab === "tops"
                  ? "border-b-2 border-brand-primary text-brand-primary"
                  : "text-brand-primary/50 hover:text-brand-primary"
              }`}
            >
              T-Shirts &amp; Polos
            </button>
            <button
              onClick={() => setActiveTab("shirts")}
              className={`pb-2 text-xs font-heading font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "shirts"
                  ? "border-b-2 border-brand-primary text-brand-primary"
                  : "text-brand-primary/50 hover:text-brand-primary"
              }`}
            >
              Oxford Shirts
            </button>
            <button
              onClick={() => setActiveTab("chinos")}
              className={`pb-2 text-xs font-heading font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "chinos"
                  ? "border-b-2 border-brand-primary text-brand-primary"
                  : "text-brand-primary/50 hover:text-brand-primary"
              }`}
            >
              Tailored Chinos
            </button>
          </div>

          <div className="flex items-center gap-1 bg-brand-secondary p-1 border border-brand-border text-xs">
            <button
              onClick={() => setUnit("in")}
              className={`px-2.5 py-1 font-semibold transition-colors ${
                unit === "in" ? "bg-white text-brand-primary shadow-sm" : "text-brand-primary/60"
              }`}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit("cm")}
              className={`px-2.5 py-1 font-semibold transition-colors ${
                unit === "cm" ? "bg-white text-brand-primary shadow-sm" : "text-brand-primary/60"
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Measurement Tables */}
        <div className="overflow-x-auto">
          {activeTab === "tops" && (
            <table className="w-full text-xs text-left border border-brand-border">
              <thead className="bg-brand-secondary text-brand-primary font-heading uppercase text-[11px] border-b border-brand-border">
                <tr>
                  <th className="p-3">Size</th>
                  <th className="p-3">Chest Width</th>
                  <th className="p-3">Body Length</th>
                  <th className="p-3">Shoulder</th>
                  <th className="p-3">Recommended Fit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                <tr>
                  <td className="p-3 font-bold">S</td>
                  <td className="p-3">{unit === "in" ? "38 in" : "96.5 cm"}</td>
                  <td className="p-3">{unit === "in" ? "27.5 in" : "70 cm"}</td>
                  <td className="p-3">{unit === "in" ? "17.5 in" : "44.5 cm"}</td>
                  <td className="p-3 text-brand-primary/70">Chest 36–38&quot;</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">M</td>
                  <td className="p-3">{unit === "in" ? "40 in" : "101.5 cm"}</td>
                  <td className="p-3">{unit === "in" ? "28.5 in" : "72.5 cm"}</td>
                  <td className="p-3">{unit === "in" ? "18.5 in" : "47 cm"}</td>
                  <td className="p-3 text-brand-primary/70">Chest 38–40&quot;</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">L</td>
                  <td className="p-3">{unit === "in" ? "42 in" : "106.5 cm"}</td>
                  <td className="p-3">{unit === "in" ? "29.5 in" : "75 cm"}</td>
                  <td className="p-3">{unit === "in" ? "19.5 in" : "49.5 cm"}</td>
                  <td className="p-3 text-brand-primary/70">Chest 40–42&quot;</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">XL</td>
                  <td className="p-3">{unit === "in" ? "44 in" : "112 cm"}</td>
                  <td className="p-3">{unit === "in" ? "30.5 in" : "77.5 cm"}</td>
                  <td className="p-3">{unit === "in" ? "20.5 in" : "52 cm"}</td>
                  <td className="p-3 text-brand-primary/70">Chest 42–44&quot;</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === "shirts" && (
            <table className="w-full text-xs text-left border border-brand-border">
              <thead className="bg-brand-secondary text-brand-primary font-heading uppercase text-[11px] border-b border-brand-border">
                <tr>
                  <th className="p-3">Size</th>
                  <th className="p-3">Collar</th>
                  <th className="p-3">Chest Width</th>
                  <th className="p-3">Sleeve Length</th>
                  <th className="p-3">Body Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                <tr>
                  <td className="p-3 font-bold">S (38)</td>
                  <td className="p-3">{unit === "in" ? "15 in" : "38 cm"}</td>
                  <td className="p-3">{unit === "in" ? "39 in" : "99 cm"}</td>
                  <td className="p-3">{unit === "in" ? "33 in" : "84 cm"}</td>
                  <td className="p-3">{unit === "in" ? "29.5 in" : "75 cm"}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">M (40)</td>
                  <td className="p-3">{unit === "in" ? "15.5 in" : "39.5 cm"}</td>
                  <td className="p-3">{unit === "in" ? "41 in" : "104 cm"}</td>
                  <td className="p-3">{unit === "in" ? "34 in" : "86.5 cm"}</td>
                  <td className="p-3">{unit === "in" ? "30.5 in" : "77.5 cm"}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">L (42)</td>
                  <td className="p-3">{unit === "in" ? "16 in" : "41 cm"}</td>
                  <td className="p-3">{unit === "in" ? "43 in" : "109 cm"}</td>
                  <td className="p-3">{unit === "in" ? "35 in" : "89 cm"}</td>
                  <td className="p-3">{unit === "in" ? "31 in" : "79 cm"}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">XL (44)</td>
                  <td className="p-3">{unit === "in" ? "16.5 in" : "42 cm"}</td>
                  <td className="p-3">{unit === "in" ? "45 in" : "114 cm"}</td>
                  <td className="p-3">{unit === "in" ? "36 in" : "91.5 cm"}</td>
                  <td className="p-3">{unit === "in" ? "31.5 in" : "80 cm"}</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === "chinos" && (
            <table className="w-full text-xs text-left border border-brand-border">
              <thead className="bg-brand-secondary text-brand-primary font-heading uppercase text-[11px] border-b border-brand-border">
                <tr>
                  <th className="p-3">Waist Size</th>
                  <th className="p-3">Waist Circumference</th>
                  <th className="p-3">Inseam</th>
                  <th className="p-3">Thigh</th>
                  <th className="p-3">Total Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                <tr>
                  <td className="p-3 font-bold">30</td>
                  <td className="p-3">{unit === "in" ? "30.5 in" : "77.5 cm"}</td>
                  <td className="p-3">{unit === "in" ? "30 in" : "76 cm"}</td>
                  <td className="p-3">{unit === "in" ? "22 in" : "56 cm"}</td>
                  <td className="p-3">{unit === "in" ? "39.5 in" : "100 cm"}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">32</td>
                  <td className="p-3">{unit === "in" ? "32.5 in" : "82.5 cm"}</td>
                  <td className="p-3">{unit === "in" ? "31 in" : "78.5 cm"}</td>
                  <td className="p-3">{unit === "in" ? "23 in" : "58.5 cm"}</td>
                  <td className="p-3">{unit === "in" ? "40.5 in" : "103 cm"}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">34</td>
                  <td className="p-3">{unit === "in" ? "34.5 in" : "87.5 cm"}</td>
                  <td className="p-3">{unit === "in" ? "32 in" : "81 cm"}</td>
                  <td className="p-3">{unit === "in" ? "24 in" : "61 cm"}</td>
                  <td className="p-3">{unit === "in" ? "41.5 in" : "105.5 cm"}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">36</td>
                  <td className="p-3">{unit === "in" ? "36.5 in" : "92.5 cm"}</td>
                  <td className="p-3">{unit === "in" ? "32 in" : "81 cm"}</td>
                  <td className="p-3">{unit === "in" ? "25 in" : "63.5 cm"}</td>
                  <td className="p-3">{unit === "in" ? "41.5 in" : "105.5 cm"}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Measuring Tip */}
        <div className="p-4 bg-brand-secondary/60 border border-brand-border text-xs space-y-1 text-brand-primary/80">
          <p className="font-semibold text-brand-primary">💡 Fit Tip:</p>
          <p>
            London Boy clothing follows British regular tailored sizing. For a relaxed or oversized streetwear drape with heavyweight t-shirts, select one size up.
          </p>
        </div>
      </div>
    </div>
  )
}
