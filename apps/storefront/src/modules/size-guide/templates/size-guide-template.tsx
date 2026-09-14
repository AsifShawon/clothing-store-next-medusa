"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function SizeGuideTemplate() {
  const [activeTab, setActiveTab] = useState<"tops" | "shirts" | "chinos">("tops")
  const [unit, setUnit] = useState<"in" | "cm">("in")

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-brand-secondary border-b border-brand-border py-12 sm:py-16">
        <div className="content-container max-w-4xl text-center space-y-3">
          <span className="text-xs font-heading font-semibold uppercase tracking-widest text-brand-accent">
            Fit &amp; Sizing Standard
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-primary">
            London Boy Size &amp; Fit Guide
          </h1>
          <p className="text-xs sm:text-sm text-brand-primary/70 max-w-xl mx-auto leading-relaxed">
            Our garments follow British modern tailored silhouettes, engineered specifically for South Asian body proportions.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="content-container max-w-4xl py-14 sm:py-20 space-y-12">
        {/* Review Callout Notice */}
        <div className="p-4 bg-brand-secondary/70 border border-brand-accent/40 rounded-none text-xs text-brand-primary/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-brand-primary uppercase text-[11px] block">
              Measurement Standard Notice
            </span>
            <p className="text-[11px] text-brand-primary/70 mt-0.5">
              [Review Note: Factory measurement tolerances are ±0.5 inch / ±1.2 cm.]
            </p>
          </div>
          <span className="text-[10px] font-heading font-semibold uppercase tracking-wider px-2 py-1 bg-white border border-brand-border text-brand-accent">
            Fabric Standard: 240 GSM
          </span>
        </div>

        {/* Tab Selection & Unit Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
          <div className="flex flex-wrap gap-2 sm:gap-4" role="tablist" aria-label="Garment categories">
            <button
              role="tab"
              aria-selected={activeTab === "tops"}
              onClick={() => setActiveTab("tops")}
              className={`pb-2 text-xs font-heading font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "tops"
                  ? "border-b-2 border-brand-primary text-brand-primary"
                  : "text-brand-primary/50 hover:text-brand-primary"
              }`}
            >
              Heavyweight T-Shirts &amp; Polos
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "shirts"}
              onClick={() => setActiveTab("shirts")}
              className={`pb-2 text-xs font-heading font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "shirts"
                  ? "border-b-2 border-brand-primary text-brand-primary"
                  : "text-brand-primary/50 hover:text-brand-primary"
              }`}
            >
              Oxford &amp; Linen Shirts
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "chinos"}
              onClick={() => setActiveTab("chinos")}
              className={`pb-2 text-xs font-heading font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "chinos"
                  ? "border-b-2 border-brand-primary text-brand-primary"
                  : "text-brand-primary/50 hover:text-brand-primary"
              }`}
            >
              Tailored Chinos &amp; Trousers
            </button>
          </div>

          <div className="flex items-center gap-1 bg-brand-secondary p-1 border border-brand-border text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setUnit("in")}
              className={`px-3 py-1 font-semibold transition-colors ${
                unit === "in" ? "bg-white text-brand-primary shadow-sm" : "text-brand-primary/60"
              }`}
            >
              Inches (in)
            </button>
            <button
              type="button"
              onClick={() => setUnit("cm")}
              className={`px-3 py-1 font-semibold transition-colors ${
                unit === "cm" ? "bg-white text-brand-primary shadow-sm" : "text-brand-primary/60"
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Tables */}
        <div className="space-y-6">
          {activeTab === "tops" && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-brand-primary">
                T-Shirts &amp; Pique Polos (240 GSM Combed Cotton)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-brand-border">
                  <thead className="bg-brand-secondary text-brand-primary font-heading uppercase text-[11px] border-b border-brand-border">
                    <tr>
                      <th className="p-3">Size</th>
                      <th className="p-3">Chest Width (Pit-to-Pit)</th>
                      <th className="p-3">Body Length</th>
                      <th className="p-3">Shoulder Width</th>
                      <th className="p-3">Recommended Chest</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    <tr>
                      <td className="p-3 font-bold text-brand-primary">S (Small)</td>
                      <td className="p-3">{unit === "in" ? '38.0"' : "96.5 cm"}</td>
                      <td className="p-3">{unit === "in" ? '27.5"' : "70.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '17.5"' : "44.5 cm"}</td>
                      <td className="p-3 text-brand-primary/70">36 – 38 in</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-brand-primary">M (Medium)</td>
                      <td className="p-3">{unit === "in" ? '40.0"' : "101.5 cm"}</td>
                      <td className="p-3">{unit === "in" ? '28.5"' : "72.5 cm"}</td>
                      <td className="p-3">{unit === "in" ? '18.5"' : "47.0 cm"}</td>
                      <td className="p-3 text-brand-primary/70">38 – 40 in</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-brand-primary">L (Large)</td>
                      <td className="p-3">{unit === "in" ? '42.0"' : "106.5 cm"}</td>
                      <td className="p-3">{unit === "in" ? '29.5"' : "75.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '19.5"' : "49.5 cm"}</td>
                      <td className="p-3 text-brand-primary/70">40 – 42 in</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-brand-primary">XL (Extra Large)</td>
                      <td className="p-3">{unit === "in" ? '44.0"' : "112.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '30.5"' : "77.5 cm"}</td>
                      <td className="p-3">{unit === "in" ? '20.5"' : "52.0 cm"}</td>
                      <td className="p-3 text-brand-primary/70">42 – 44 in</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "shirts" && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-brand-primary">
                British Oxford &amp; French Linen Shirts
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-brand-border">
                  <thead className="bg-brand-secondary text-brand-primary font-heading uppercase text-[11px] border-b border-brand-border">
                    <tr>
                      <th className="p-3">Collar Size</th>
                      <th className="p-3">Collar Circumference</th>
                      <th className="p-3">Chest Width</th>
                      <th className="p-3">Sleeve Length</th>
                      <th className="p-3">Total Body Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    <tr>
                      <td className="p-3 font-bold text-brand-primary">S (38)</td>
                      <td className="p-3">{unit === "in" ? '15.0"' : "38.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '39.0"' : "99.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '33.0"' : "84.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '29.5"' : "75.0 cm"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-brand-primary">M (40)</td>
                      <td className="p-3">{unit === "in" ? '15.5"' : "39.5 cm"}</td>
                      <td className="p-3">{unit === "in" ? '41.0"' : "104.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '34.0"' : "86.5 cm"}</td>
                      <td className="p-3">{unit === "in" ? '30.5"' : "77.5 cm"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-brand-primary">L (42)</td>
                      <td className="p-3">{unit === "in" ? '16.0"' : "41.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '43.0"' : "109.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '35.0"' : "89.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '31.0"' : "79.0 cm"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-brand-primary">XL (44)</td>
                      <td className="p-3">{unit === "in" ? '16.5"' : "42.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '45.0"' : "114.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '36.0"' : "91.5 cm"}</td>
                      <td className="p-3">{unit === "in" ? '31.5"' : "80.0 cm"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "chinos" && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-brand-primary">
                Tailored Stretch Cotton Chinos
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-brand-border">
                  <thead className="bg-brand-secondary text-brand-primary font-heading uppercase text-[11px] border-b border-brand-border">
                    <tr>
                      <th className="p-3">Waist Tag</th>
                      <th className="p-3">Waist Circumference</th>
                      <th className="p-3">Inseam Length</th>
                      <th className="p-3">Thigh Width</th>
                      <th className="p-3">Leg Opening</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    <tr>
                      <td className="p-3 font-bold text-brand-primary">30</td>
                      <td className="p-3">{unit === "in" ? '30.5"' : "77.5 cm"}</td>
                      <td className="p-3">{unit === "in" ? '30.0"' : "76.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '22.0"' : "56.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '13.5"' : "34.5 cm"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-brand-primary">32</td>
                      <td className="p-3">{unit === "in" ? '32.5"' : "82.5 cm"}</td>
                      <td className="p-3">{unit === "in" ? '31.0"' : "78.5 cm"}</td>
                      <td className="p-3">{unit === "in" ? '23.0"' : "58.5 cm"}</td>
                      <td className="p-3">{unit === "in" ? '14.0"' : "35.5 cm"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-brand-primary">34</td>
                      <td className="p-3">{unit === "in" ? '34.5"' : "87.5 cm"}</td>
                      <td className="p-3">{unit === "in" ? '32.0"' : "81.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '24.0"' : "61.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '14.5"' : "37.0 cm"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-brand-primary">36</td>
                      <td className="p-3">{unit === "in" ? '36.5"' : "92.5 cm"}</td>
                      <td className="p-3">{unit === "in" ? '32.0"' : "81.0 cm"}</td>
                      <td className="p-3">{unit === "in" ? '25.0"' : "63.5 cm"}</td>
                      <td className="p-3">{unit === "in" ? '15.0"' : "38.0 cm"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* How to Measure Guide */}
        <div className="pt-8 border-t border-brand-border/60 space-y-6">
          <h3 className="font-display text-2xl text-brand-primary">
            How to Take Your Measurements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-brand-primary/80">
            <div className="p-4 bg-brand-card border border-brand-border space-y-2">
              <h4 className="font-heading font-bold uppercase tracking-wider text-brand-primary">
                1. Chest / Bust
              </h4>
              <p className="leading-relaxed">
                Measure around the fullest part of your chest, keeping the tape measure horizontal under your arms.
              </p>
            </div>
            <div className="p-4 bg-brand-card border border-brand-border space-y-2">
              <h4 className="font-heading font-bold uppercase tracking-wider text-brand-primary">
                2. Body Length
              </h4>
              <p className="leading-relaxed">
                Measure from the highest point of the shoulder collar down to the bottom hemline.
              </p>
            </div>
            <div className="p-4 bg-brand-card border border-brand-border space-y-2">
              <h4 className="font-heading font-bold uppercase tracking-wider text-brand-primary">
                3. Waist &amp; Inseam
              </h4>
              <p className="leading-relaxed">
                Measure around your natural waistline where your trousers normally sit. For inseam, measure from crotch seam to hem.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6 border-t border-brand-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-brand-primary">Still unsure about your size?</h4>
            <p className="text-xs text-brand-primary/70">
              Our Dhaka styling team offers personalized fit advice via email or phone.
            </p>
          </div>
          <div className="flex gap-3">
            <LocalizedClientLink
              href="/contact"
              className="px-6 py-2.5 bg-brand-primary text-white text-xs font-heading font-semibold uppercase tracking-wider hover:bg-black"
            >
              Ask Our Stylist →
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store"
              className="px-6 py-2.5 bg-brand-secondary border border-brand-border text-brand-primary text-xs font-heading font-semibold uppercase tracking-wider hover:bg-white"
            >
              Shop Catalog
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}
