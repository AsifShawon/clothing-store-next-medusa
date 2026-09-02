"use client"

import React, { useState } from "react"
import { Modal } from "../ui/modal"

export interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  productCategory?: string
}

type GarmentCategory = "tops" | "shirts" | "chinos"
type UnitType = "in" | "cm"

interface SizeRow {
  size: string
  inValues: string[]
  cmValues: string[]
  fit: string
}

const TABLES: Record<
  GarmentCategory,
  {
    title: string
    headers: string[]
    rows: SizeRow[]
  }
> = {
  tops: {
    title: "T-Shirts & Polos (240 GSM Combed Cotton)",
    headers: ["Size", "Chest Width", "Body Length", "Shoulder", "Recommended Fit"],
    rows: [
      { size: "S", inValues: ["38 in", "27.5 in", "17.5 in"], cmValues: ["96.5 cm", "70 cm", "44.5 cm"], fit: 'Chest 36–38"' },
      { size: "M", inValues: ["40 in", "28.5 in", "18.5 in"], cmValues: ["101.5 cm", "72.5 cm", "47 cm"], fit: 'Chest 38–40"' },
      { size: "L", inValues: ["42 in", "29.5 in", "19.5 in"], cmValues: ["106.5 cm", "75 cm", "49.5 cm"], fit: 'Chest 40–42"' },
      { size: "XL", inValues: ["44 in", "30.5 in", "20.5 in"], cmValues: ["112 cm", "77.5 cm", "52 cm"], fit: 'Chest 42–44"' },
    ],
  },
  shirts: {
    title: "Tailored Oxford & French Linen Shirts",
    headers: ["Size", "Collar", "Chest Width", "Sleeve", "Body Length"],
    rows: [
      { size: "S (38)", inValues: ["15 in", "39 in", "33 in", "29.5 in"], cmValues: ["38 cm", "99 cm", "84 cm", "75 cm"], fit: 'Collar 15"' },
      { size: "M (40)", inValues: ["15.5 in", "41 in", "34 in", "30.5 in"], cmValues: ["39.5 cm", "104 cm", "86.5 cm", "77.5 cm"], fit: 'Collar 15.5"' },
      { size: "L (42)", inValues: ["16 in", "43 in", "35 in", "31 in"], cmValues: ["41 cm", "109 cm", "89 cm", "79 cm"], fit: 'Collar 16"' },
      { size: "XL (44)", inValues: ["16.5 in", "45 in", "36 in", "31.5 in"], cmValues: ["42 cm", "114 cm", "91.5 cm", "80 cm"], fit: 'Collar 16.5"' },
    ],
  },
  chinos: {
    title: "Tailored Smart Chinos",
    headers: ["Waist Size", "Waist Circumference", "Inseam", "Thigh", "Total Length"],
    rows: [
      { size: "30", inValues: ["30.5 in", "30 in", "22 in", "39.5 in"], cmValues: ["77.5 cm", "76 cm", "56 cm", "100 cm"], fit: 'Waist 30"' },
      { size: "32", inValues: ["32.5 in", "31 in", "23 in", "40.5 in"], cmValues: ["82.5 cm", "78.5 cm", "58.5 cm", "103 cm"], fit: 'Waist 32"' },
      { size: "34", inValues: ["34.5 in", "32 in", "24 in", "41.5 in"], cmValues: ["87.5 cm", "81 cm", "61 cm", "105.5 cm"], fit: 'Waist 34"' },
      { size: "36", inValues: ["36.5 in", "32 in", "25 in", "41.5 in"], cmValues: ["92.5 cm", "81 cm", "63.5 cm", "105.5 cm"], fit: 'Waist 36"' },
    ],
  },
}

export function SizeGuideModal({
  isOpen,
  onClose,
  productCategory,
}: SizeGuideModalProps) {
  const initialCategory: GarmentCategory = productCategory?.toLowerCase().includes("shirt")
    ? "shirts"
    : productCategory?.toLowerCase().includes("chino") || productCategory?.toLowerCase().includes("pant")
    ? "chinos"
    : "tops"

  const [activeTab, setActiveTab] = useState<GarmentCategory>(initialCategory)
  const [unit, setUnit] = useState<UnitType>("in")

  const currentTable = TABLES[activeTab]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="London Boy Size & Fit Guide"
      maxWidth="2xl"
    >
      <div className="space-y-6 text-xs text-brand-primary">
        {/* Tab & Unit Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex border-b border-brand-border sm:border-b-0 gap-3">
            {(
              [
                ["tops", "T-Shirts & Polos"],
                ["shirts", "Oxford Shirts"],
                ["chinos", "Tailored Chinos"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`pb-2 text-xs font-heading font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === key
                    ? "border-b-2 border-brand-primary text-brand-primary"
                    : "text-brand-muted hover:text-brand-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-brand-secondary p-1 border border-brand-border text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setUnit("in")}
              className={`px-2.5 py-1 font-semibold transition-colors ${
                unit === "in" ? "bg-white text-brand-primary shadow-xs" : "text-brand-muted"
              }`}
            >
              Inches (in)
            </button>
            <button
              type="button"
              onClick={() => setUnit("cm")}
              className={`px-2.5 py-1 font-semibold transition-colors ${
                unit === "cm" ? "bg-white text-brand-primary shadow-xs" : "text-brand-muted"
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto border border-brand-border">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-brand-secondary text-brand-primary font-heading uppercase text-[11px] border-b border-brand-border">
              <tr>
                {currentTable.headers.map((h) => (
                  <th key={h} className="p-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {currentTable.rows.map((row) => (
                <tr key={row.size} className="hover:bg-brand-secondary/30 transition-colors">
                  <td className="p-3 font-bold">{row.size}</td>
                  {(unit === "in" ? row.inValues : row.cmValues).map((v, i) => (
                    <td key={i} className="p-3 font-mono text-grey-70">
                      {v}
                    </td>
                  ))}
                  {row.fit && <td className="p-3 text-brand-muted">{row.fit}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fit Tip */}
        <div className="p-4 bg-brand-secondary/60 border border-brand-border text-xs space-y-1 text-brand-primary/80">
          <p className="font-semibold text-brand-primary">💡 Fit Tip:</p>
          <p>
            London Boy clothing follows British regular tailored sizing. For a relaxed or oversized streetwear drape with heavyweight t-shirts, select one size up.
          </p>
        </div>
      </div>
    </Modal>
  )
}
