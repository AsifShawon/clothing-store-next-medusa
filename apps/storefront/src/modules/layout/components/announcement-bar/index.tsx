"use client"

import { AnnouncementBar as SharedAnnouncementBar } from "@dtc/storefront-ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function AnnouncementBar() {
  return (
    <SharedAnnouncementBar
      linkComponent={LocalizedClientLink}
      centerHref="/store"
      rightLinkHref="/return-policy"
    />
  )
}
