import { HttpTypes } from "@medusajs/types"
import { ImageGallery as SharedImageGallery } from "@dtc/storefront-ui"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const imageViews = (images || []).map((img, idx) => ({
    id: img.id || String(idx),
    url: img.url || "",
    altText: "Garment visual",
  }))

  return <SharedImageGallery images={imageViews} />
}

export default ImageGallery
