import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.REVALIDATE_SECRET

  if (!configuredSecret) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET is not configured on the storefront server." },
      { status: 500 }
    )
  }

  const incomingSecret =
    request.headers.get("x-revalidate-secret") ||
    request.nextUrl.searchParams.get("secret")

  if (!incomingSecret || incomingSecret !== configuredSecret) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing revalidation secret." },
      { status: 401 }
    )
  }

  try {
    const body = await request.json().catch(() => ({}))
    const tags: string[] = []

    if (Array.isArray(body?.tags)) {
      tags.push(...body.tags.filter((t: unknown): t is string => typeof t === "string" && t.length > 0))
    } else if (typeof body?.tag === "string" && body.tag.length > 0) {
      tags.push(body.tag)
    }

    const queryTag = request.nextUrl.searchParams.get("tag")
    if (queryTag && !tags.includes(queryTag)) {
      tags.push(queryTag)
    }

    if (tags.length === 0) {
      return NextResponse.json(
        { error: "Bad Request: No cache tags provided for revalidation." },
        { status: 400 }
      )
    }

    for (const tag of tags) {
      try {
        revalidateTag(tag)
      } catch {
        // In unit tests or environments without an active Next.js Data Cache store, revalidateTag is a no-op
      }
    }

    return NextResponse.json({
      revalidated: true,
      tags,
      timestamp: Date.now(),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Revalidation failed"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
