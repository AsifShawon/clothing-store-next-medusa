"use client"

import React, { useState } from "react"
import Image from "next/image"
import clsx from "clsx"
import { ImageView } from "@dtc/commerce-contracts"

export interface ImageGalleryProps {
  images: ImageView[]
  title?: string
}

export function ImageGallery({ images, title = "Garment" }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] w-full bg-brand-secondary border border-brand-border flex items-center justify-center text-brand-muted text-xs">
        No Image Available
      </div>
    )
  }

  const activeImage = images[selectedIndex] || images[0]

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:w-20 flex-shrink-0">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={clsx(
                "relative aspect-[3/4] w-16 lg:w-20 bg-brand-secondary border transition-all flex-shrink-0 overflow-hidden",
                selectedIndex === idx
                  ? "border-brand-primary ring-1 ring-brand-primary"
                  : "border-brand-border hover:border-brand-muted opacity-70 hover:opacity-100"
              )}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={img.url}
                alt={`${title} - Thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main showcase image */}
      <div className="relative aspect-[3/4] w-full bg-brand-secondary border border-brand-border overflow-hidden flex-1 group">
        <Image
          src={activeImage.url}
          alt={activeImage.altText || `${title} - Main Image`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
      </div>
    </div>
  )
}
