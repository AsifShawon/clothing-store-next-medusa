"use client"

import React from "react"
import Link from "next/link"
import { AnnouncementBar as SharedAnnouncementBar } from "@dtc/storefront-ui"

export function AnnouncementBar() {
  return (
    <SharedAnnouncementBar
      centerText="Complimentary Delivery Across Bangladesh On Orders Over ৳3,000 | Code LONDON10"
      centerHref="/shop"
      rightLinkText="Shop New Season"
      rightLinkHref="/shop"
      showDismiss={false}
      linkComponent={Link}
    />
  )
}
