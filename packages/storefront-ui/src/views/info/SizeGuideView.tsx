"use client"

import React, { useState } from "react"
import Link from "next/link"
import { StoreRoutes } from "@dtc/commerce-contracts"
import { ShieldCheckIcon } from "../../components/icons"
import { LinkComponent } from "../../types"

export interface SizeGuideViewProps {
  routes: StoreRoutes
  linkComponent?: LinkComponent
}

export function SizeGuideView({ routes, linkComponent: LinkComp = Link }: SizeGuideViewProps) {
  const [activeTab, setActiveTab] = useState<"tops" | "shirts" | "chinos">("tops")
  const [unit, setUnit] = useState<"in" | "cm">("in")

  const round = (val: number) => (unit === "in" ? val : Math.round(val * 2.54))

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
                  : "text-brand-muted hover:text-brand-primary"
              }`}
            >
              Heavyweight Tees &amp; Polos
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "shirts"}
              onClick={() => setActiveTab("shirts")}
              className={`pb-2 text-xs font-heading font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "shirts"
                  ? "border-b-2 border-brand-primary text-brand-primary"
                  : "text-brand-muted hover:text-brand-primary"
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
                  : "text-brand-muted hover:text-brand-primary"
              }`}
            >
              Tailored Chinos
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-heading font-semibold uppercase tracking-wider text-brand-muted">
              Unit:
            </span>
            <div className="flex border border-brand-border text-xs">
              <button
                type="button"
                onClick={() => setUnit("in")}
                className={`px-3 py-1 font-mono uppercase transition-colors ${
                  unit === "in" ? "bg-brand-primary text-white" : "bg-white text-brand-primary"
                }`}
              >
                Inches
              </button>
              <button
                type="button"
                onClick={() => setUnit("cm")}
                className={`px-3 py-1 font-mono uppercase transition-colors ${
                  unit === "cm" ? "bg-brand-primary text-white" : "bg-white text-brand-primary"
                }`}
              >
                CM
              </button>
            </div>
          </div>
        </div>

        {/* Tops Table */}
        {activeTab === "tops" && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-primary">
              Heavyweight Cotton T-Shirt &amp; Polo Sizing ({unit.toUpperCase()})
            </h3>
            <div className="overflow-x-auto border border-brand-border">
              <table className="w-full text-xs text-left">
                <thead className="bg-brand-secondary text-brand-primary font-heading font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Size</th>
                    <th className="p-3">Chest Circumference</th>
                    <th className="p-3">Garment Length</th>
                    <th className="p-3">Shoulder Width</th>
                    <th className="p-3">Sleeve Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  <tr>
                    <td className="p-3 font-bold">S</td>
                    <td className="p-3 font-mono">{round(38)}</td>
                    <td className="p-3 font-mono">{round(27.5)}</td>
                    <td className="p-3 font-mono">{round(17.5)}</td>
                    <td className="p-3 font-mono">{round(8.5)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">M</td>
                    <td className="p-3 font-mono">{round(40)}</td>
                    <td className="p-3 font-mono">{round(28.5)}</td>
                    <td className="p-3 font-mono">{round(18.25)}</td>
                    <td className="p-3 font-mono">{round(8.75)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">L</td>
                    <td className="p-3 font-mono">{round(42)}</td>
                    <td className="p-3 font-mono">{round(29.5)}</td>
                    <td className="p-3 font-mono">{round(19)}</td>
                    <td className="p-3 font-mono">{round(9)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">XL</td>
                    <td className="p-3 font-mono">{round(44)}</td>
                    <td className="p-3 font-mono">{round(30.5)}</td>
                    <td className="p-3 font-mono">{round(19.75)}</td>
                    <td className="p-3 font-mono">{round(9.25)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Shirts Table */}
        {activeTab === "shirts" && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-primary">
              Oxford &amp; Linen Shirt Sizing ({unit.toUpperCase()})
            </h3>
            <div className="overflow-x-auto border border-brand-border">
              <table className="w-full text-xs text-left">
                <thead className="bg-brand-secondary text-brand-primary font-heading font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Size</th>
                    <th className="p-3">Chest</th>
                    <th className="p-3">Length</th>
                    <th className="p-3">Collar</th>
                    <th className="p-3">Full Sleeve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  <tr>
                    <td className="p-3 font-bold">S</td>
                    <td className="p-3 font-mono">{round(39)}</td>
                    <td className="p-3 font-mono">{round(29)}</td>
                    <td className="p-3 font-mono">{round(15)}</td>
                    <td className="p-3 font-mono">{round(24.5)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">M</td>
                    <td className="p-3 font-mono">{round(41)}</td>
                    <td className="p-3 font-mono">{round(30)}</td>
                    <td className="p-3 font-mono">{round(15.5)}</td>
                    <td className="p-3 font-mono">{round(25)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">L</td>
                    <td className="p-3 font-mono">{round(43)}</td>
                    <td className="p-3 font-mono">{round(31)}</td>
                    <td className="p-3 font-mono">{round(16)}</td>
                    <td className="p-3 font-mono">{round(25.5)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">XL</td>
                    <td className="p-3 font-mono">{round(45)}</td>
                    <td className="p-3 font-mono">{round(32)}</td>
                    <td className="p-3 font-mono">{round(16.5)}</td>
                    <td className="p-3 font-mono">{round(26)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Chinos Table */}
        {activeTab === "chinos" && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-primary">
              Tailored Chino Trousers Sizing ({unit.toUpperCase()})
            </h3>
            <div className="overflow-x-auto border border-brand-border">
              <table className="w-full text-xs text-left">
                <thead className="bg-brand-secondary text-brand-primary font-heading font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Waist</th>
                    <th className="p-3">Hip Circumference</th>
                    <th className="p-3">Thigh</th>
                    <th className="p-3">Inseam</th>
                    <th className="p-3">Leg Opening</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  <tr>
                    <td className="p-3 font-bold">30</td>
                    <td className="p-3 font-mono">{round(38)}</td>
                    <td className="p-3 font-mono">{round(23)}</td>
                    <td className="p-3 font-mono">{round(30)}</td>
                    <td className="p-3 font-mono">{round(13.5)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">32</td>
                    <td className="p-3 font-mono">{round(40)}</td>
                    <td className="p-3 font-mono">{round(24)}</td>
                    <td className="p-3 font-mono">{round(31)}</td>
                    <td className="p-3 font-mono">{round(14)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">34</td>
                    <td className="p-3 font-mono">{round(42)}</td>
                    <td className="p-3 font-mono">{round(25)}</td>
                    <td className="p-3 font-mono">{round(32)}</td>
                    <td className="p-3 font-mono">{round(14.5)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">36</td>
                    <td className="p-3 font-mono">{round(44)}</td>
                    <td className="p-3 font-mono">{round(26)}</td>
                    <td className="p-3 font-mono">{round(32)}</td>
                    <td className="p-3 font-mono">{round(15)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Door-to-Door Exchange Reassurance */}
        <div className="p-6 bg-brand-surface border border-brand-border flex items-center gap-4 text-xs">
          <ShieldCheckIcon className="w-8 h-8 text-brand-accent flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="font-heading font-bold uppercase tracking-wider text-brand-primary text-xs">
              24-Hour Door-to-Door Size Exchange Guarantee
            </h4>
            <p className="text-brand-muted leading-relaxed">
              Unsure between sizes? Order with total confidence. We will dispatch your alternate size directly to your doorstep inside Dhaka within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
