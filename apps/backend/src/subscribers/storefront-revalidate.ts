import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function storefrontRevalidateHandler({
  event: { name },
  container,
}: SubscriberArgs<Record<string, unknown>>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const storefrontUrl = process.env.STOREFRONT_URL || "http://localhost:8000"
  const revalidateSecret = process.env.REVALIDATE_SECRET

  if (!revalidateSecret) {
    logger.debug(
      `[Storefront Revalidate] Event "${name}" received, but REVALIDATE_SECRET is not configured. Skipping storefront webhook.`
    )
    return
  }

  const tagsToRevalidate: string[] = []

  if (name.startsWith("product.")) {
    tagsToRevalidate.push("products")
  } else if (name.startsWith("product_category.")) {
    tagsToRevalidate.push("categories", "products")
  } else if (name.startsWith("product_collection.")) {
    tagsToRevalidate.push("collections", "products")
  } else if (name.startsWith("region.")) {
    tagsToRevalidate.push("regions")
  } else if (name.startsWith("price_set.")) {
    tagsToRevalidate.push("products")
  } else {
    tagsToRevalidate.push("products")
  }

  const revalidateEndpoint = `${storefrontUrl.replace(/\/$/, "")}/api/revalidate`

  try {
    const response = await fetch(revalidateEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": revalidateSecret,
      },
      body: JSON.stringify({
        event: name,
        tags: tagsToRevalidate,
      }),
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      logger.warn(
        `[Storefront Revalidate] Failed to revalidate tags [${tagsToRevalidate.join(", ")}] on storefront: ${response.status} ${errorText}`
      )
      return
    }

    const data = await response.json().catch(() => ({}))
    logger.info(
      `[Storefront Revalidate] Successfully revalidated tags [${tagsToRevalidate.join(", ")}] for event "${name}".`
    )
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    logger.warn(
      `[Storefront Revalidate] Network error contacting storefront at ${revalidateEndpoint}: ${msg}`
    )
  }
}

export const config: SubscriberConfig = {
  event: [
    "product.created",
    "product.updated",
    "product.deleted",
    "product_category.created",
    "product_category.updated",
    "product_category.deleted",
    "product_collection.created",
    "product_collection.updated",
    "product_collection.deleted",
    "region.created",
    "region.updated",
    "region.deleted",
    "price_set.created",
    "price_set.updated",
    "price_set.deleted",
  ],
}
