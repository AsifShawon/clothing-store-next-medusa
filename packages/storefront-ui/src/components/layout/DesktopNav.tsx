import React from "react"
import Link from "next/link"
import clsx from "clsx"

import { LinkComponent } from "../../types"

export interface NavLinkItem {
  label: string
  href: string
  isActive?: boolean
}

export interface DesktopNavProps {
  links: NavLinkItem[]
  linkComponent?: LinkComponent
}

export function DesktopNav({
  links,
  linkComponent: LinkComp = Link,
}: DesktopNavProps) {
  return (
    <nav className="hidden lg:flex items-center gap-x-7 text-xs font-semibold uppercase tracking-wider text-brand-primary">
      {links.map((link) => (
        <LinkComp
          key={link.href}
          href={link.href}
          className={clsx(
            "transition-colors duration-150 py-2 border-b-2 hover:text-brand-accent hover:border-brand-accent",
            link.isActive
              ? "text-brand-accent border-brand-accent font-bold"
              : "text-brand-primary border-transparent"
          )}
        >
          {link.label}
        </LinkComp>
      ))}
    </nav>
  )
}
