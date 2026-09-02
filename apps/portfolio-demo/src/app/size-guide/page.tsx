import React from "react"
import Link from "next/link"

export default function SizeGuidePage() {
  return (
    <div className="content-container py-16 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <span className="badge-tag bg-brand-secondary text-brand-accent">Precision Fit</span>
        <h1 className="font-display text-4xl text-brand-primary">Size & Measurement Guide</h1>
        <p className="text-sm text-grey-60 max-w-xl mx-auto">
          All measurements are listed in inches. Compare these against your favorite well-fitting garment laid flat.
        </p>
      </div>

      {/* 1. Heavyweight T-Shirts Chart */}
      <div className="bg-white border border-brand-border p-6 space-y-4">
        <h2 className="font-heading font-semibold text-base text-brand-primary border-b border-brand-border pb-2">
          Signature Heavyweight T-Shirt (Regular Structured Fit)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-brand-card text-grey-60 border-b border-brand-border font-semibold uppercase">
              <tr>
                <th className="p-3">Size</th>
                <th className="p-3">Chest (Inches)</th>
                <th className="p-3">Length (Inches)</th>
                <th className="p-3">Shoulder (Inches)</th>
                <th className="p-3">Sleeve (Inches)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 text-grey-70">
              <tr>
                <td className="p-3 font-bold text-brand-primary">S</td>
                <td className="p-3">38 - 40</td>
                <td className="p-3">27.5</td>
                <td className="p-3">18.0</td>
                <td className="p-3">8.5</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-brand-primary">M</td>
                <td className="p-3">40 - 42</td>
                <td className="p-3">28.5</td>
                <td className="p-3">19.0</td>
                <td className="p-3">9.0</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-brand-primary">L</td>
                <td className="p-3">42 - 44</td>
                <td className="p-3">29.5</td>
                <td className="p-3">20.0</td>
                <td className="p-3">9.5</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-brand-primary">XL</td>
                <td className="p-3">44 - 46</td>
                <td className="p-3">30.5</td>
                <td className="p-3">21.0</td>
                <td className="p-3">10.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Oxford Shirts Chart */}
      <div className="bg-white border border-brand-border p-6 space-y-4">
        <h2 className="font-heading font-semibold text-base text-brand-primary border-b border-brand-border pb-2">
          Oxford Button-Down Shirt (Tailored Slim Fit)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-brand-card text-grey-60 border-b border-brand-border font-semibold uppercase">
              <tr>
                <th className="p-3">Size</th>
                <th className="p-3">Collar (Inches)</th>
                <th className="p-3">Chest (Inches)</th>
                <th className="p-3">Length (Inches)</th>
                <th className="p-3">Sleeve Length (Inches)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 text-grey-70">
              <tr>
                <td className="p-3 font-bold text-brand-primary">S</td>
                <td className="p-3">15.0</td>
                <td className="p-3">38</td>
                <td className="p-3">29.0</td>
                <td className="p-3">24.5</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-brand-primary">M</td>
                <td className="p-3">15.5</td>
                <td className="p-3">40</td>
                <td className="p-3">30.0</td>
                <td className="p-3">25.0</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-brand-primary">L</td>
                <td className="p-3">16.0</td>
                <td className="p-3">42</td>
                <td className="p-3">31.0</td>
                <td className="p-3">25.5</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-brand-primary">XL</td>
                <td className="p-3">16.5</td>
                <td className="p-3">44</td>
                <td className="p-3">31.5</td>
                <td className="p-3">26.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Mayfair Chinos Chart */}
      <div className="bg-white border border-brand-border p-6 space-y-4">
        <h2 className="font-heading font-semibold text-base text-brand-primary border-b border-brand-border pb-2">
          Mayfair Tailored Chinos (Tapered Leg)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-brand-card text-grey-60 border-b border-brand-border font-semibold uppercase">
              <tr>
                <th className="p-3">Waist Tag</th>
                <th className="p-3">Actual Waist (Inches)</th>
                <th className="p-3">Hip (Inches)</th>
                <th className="p-3">Thigh (Inches)</th>
                <th className="p-3">Inseam (Inches)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 text-grey-70">
              <tr>
                <td className="p-3 font-bold text-brand-primary">30</td>
                <td className="p-3">31</td>
                <td className="p-3">38</td>
                <td className="p-3">22.5</td>
                <td className="p-3">30.0</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-brand-primary">32</td>
                <td className="p-3">33</td>
                <td className="p-3">40</td>
                <td className="p-3">23.5</td>
                <td className="p-3">30.5</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-brand-primary">34</td>
                <td className="p-3">35</td>
                <td className="p-3">42</td>
                <td className="p-3">24.5</td>
                <td className="p-3">31.0</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-brand-primary">36</td>
                <td className="p-3">37</td>
                <td className="p-3">44</td>
                <td className="p-3">25.5</td>
                <td className="p-3">31.5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Link href="/shop" className="contrast-btn text-xs">
          Return to Shop
        </Link>
      </div>
    </div>
  )
}
