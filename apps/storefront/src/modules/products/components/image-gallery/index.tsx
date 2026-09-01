import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[3/4] w-full bg-brand-secondary flex items-center justify-center border border-brand-border">
        <span className="text-xs font-semibold text-brand-muted uppercase tracking-widest">
          London Boy Image
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {images.map((image, index) => {
        return (
          <div
            key={image.id || index}
            className="relative aspect-[3/4] w-full overflow-hidden bg-brand-secondary border border-brand-border"
            id={image.id}
          >
            {!!image.url && (
              <Image
                src={image.url}
                priority={index === 0}
                className="object-cover object-center w-full h-full hover:scale-102 transition-transform duration-500"
                alt={`Product visual ${index + 1}`}
                fill
                sizes="(max-width: 576px) 100vw, (max-width: 1024px) 50vw, 600px"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ImageGallery
