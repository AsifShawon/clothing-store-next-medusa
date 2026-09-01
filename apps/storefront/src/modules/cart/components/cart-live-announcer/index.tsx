"use client"

import { useEffect, useRef, useState } from "react"
import { HttpTypes } from "@medusajs/types"

type CartLiveAnnouncerProps = {
  cart?: HttpTypes.StoreCart | null
}

export default function CartLiveAnnouncer({ cart }: CartLiveAnnouncerProps) {
  const [announcement, setAnnouncement] = useState("")
  const previousItemCountRef = useRef<number | null>(null)
  const isInitialMount = useRef(true)

  const currentCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      previousItemCountRef.current = currentCount
      return
    }

    if (previousItemCountRef.current !== null && previousItemCountRef.current !== currentCount) {
      const diff = currentCount - previousItemCountRef.current
      if (diff > 0) {
        setAnnouncement(`Added ${diff} item${diff > 1 ? "s" : ""} to shopping bag. Bag now contains ${currentCount} item${currentCount > 1 ? "s" : ""}.`)
      } else if (diff < 0) {
        const removed = Math.abs(diff)
        setAnnouncement(`Removed ${removed} item${removed > 1 ? "s" : ""} from shopping bag. Bag now contains ${currentCount} item${currentCount > 1 ? "s" : ""}.`)
      }
      previousItemCountRef.current = currentCount
    }
  }, [currentCount])

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {announcement}
    </div>
  )
}
