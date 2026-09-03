"use client"

import { SizeGuideModal as SharedSizeGuideModal } from "@dtc/storefront-ui"

type SizeGuideModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  return <SharedSizeGuideModal isOpen={isOpen} onClose={onClose} />
}
