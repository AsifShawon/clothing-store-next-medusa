import { getLocaleHeader } from "@lib/util/get-locale-header"
import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk"

import { getMedusaBackendUrl, getClientEnv } from "@lib/util/env"

const backendUrl = getMedusaBackendUrl()
const clientEnv = getClientEnv()

export const sdk = new Medusa({
  baseUrl: backendUrl,
  debug: process.env.NODE_ENV === "development",
  publishableKey: clientEnv.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const originalFetch = sdk.client.fetch.bind(sdk.client)

sdk.client.fetch = async <T>(
  input: FetchInput,
  init?: FetchArgs
): Promise<T> => {
  const headers = init?.headers ?? {}
  let localeHeader: Record<string, string | null> | undefined
  try {
    localeHeader = await getLocaleHeader()
    headers["x-medusa-locale"] ??= localeHeader["x-medusa-locale"]
  } catch {}

  const newHeaders = {
    ...localeHeader,
    ...headers,
  }
  init = {
    ...init,
    headers: newHeaders,
  }
  return originalFetch(input, init)
}
