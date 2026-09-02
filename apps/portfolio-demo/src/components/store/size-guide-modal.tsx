"use client"

import { SizeGuideModal as SharedSizeGuideModal } from "@dtc/storefront-ui"

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  productCategory?: string
}

export function SizeGuideModal({ isOpen, onClose, productCategory }: SizeGuideModalProps) {
  return (
    <SharedSizeGuideModal
      isOpen={isOpen}
      onClose={onClose}
      productCategory={productCategory}
    />
  )
}
