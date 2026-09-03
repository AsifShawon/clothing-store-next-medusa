import React from "react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: string
}

export function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white p-5 border border-brand-border shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-grey-50">{title}</span>
        {icon && <div className="text-brand-accent p-2 bg-brand-secondary">{icon}</div>}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold font-heading text-brand-primary">{value}</div>
        {(subtitle || trend) && (
          <div className="mt-1 flex items-center gap-2 text-xs text-grey-50">
            {trend && <span className="text-emerald-700 font-medium">{trend}</span>}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
