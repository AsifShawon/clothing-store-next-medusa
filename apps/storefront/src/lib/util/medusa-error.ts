type MedusaErrorLike = {
  response?: {
    data?: { message?: string; error?: string; type?: string } | string
    status?: number
    headers?: unknown
  }
  request?: unknown
  message?: string
  statusText?: string
  config?: { url?: string; baseURL?: string }
}

export default function medusaError(error: unknown): never {
  if (typeof error === "string") {
    throw new Error(error)
  }

  const err = error as MedusaErrorLike

  if (err?.response?.data) {
    const data = err.response.data
    let message = ""

    if (typeof data === "object" && data !== null) {
      message = data.message || data.error || JSON.stringify(data)
    } else if (typeof data === "string") {
      message = data
    }

    if (message) {
      const formatted = message.charAt(0).toUpperCase() + message.slice(1)
      throw new Error(formatted.endsWith(".") ? formatted : `${formatted}.`)
    }
  }

  if (err?.message) {
    // If the error message starts with JSON or FetchError, clean it up
    let message = err.message
    if (message.includes("is not valid") || message.includes("not found")) {
      message = message.replace(/^Error:\s*/, "")
    }
    const formatted = message.charAt(0).toUpperCase() + message.slice(1)
    throw new Error(formatted.endsWith(".") ? formatted : `${formatted}.`)
  }

  if (err?.request) {
    throw new Error("No response received from Medusa server. Please check your connection.")
  }

  throw new Error("An unexpected error occurred while processing your request.")
}
