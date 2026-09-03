import React from "react"

export type LinkComponent = React.ComponentType<{
  href: string
  className?: string
  children?: React.ReactNode
  [key: string]: unknown
}>
