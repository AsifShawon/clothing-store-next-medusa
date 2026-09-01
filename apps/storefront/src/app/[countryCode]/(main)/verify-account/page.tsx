import { Metadata } from "next"
import { Suspense } from "react"
import { constructMetadata } from "@lib/util/seo"
import VerifyAccount from "@modules/account/components/verify-account"

export const metadata: Metadata = constructMetadata({
  title: "Verify Your Email | London Boy",
  description: "Verify your email address to complete your registration.",
  noIndex: true,
})

export default function VerifyAccountPage() {
  return (
    <div className="w-full flex justify-center px-8 py-12">
      <Suspense
        fallback={
          <p className="text-base-regular text-ui-fg-base">
            Verifying your email...
          </p>
        }
      >
        <VerifyAccount />
      </Suspense>
    </div>
  )
}
