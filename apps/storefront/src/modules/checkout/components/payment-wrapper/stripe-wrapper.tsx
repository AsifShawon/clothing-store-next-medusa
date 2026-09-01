"use client"

import { Stripe, StripeElementsOptions } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { HttpTypes } from "@medusajs/types"
import React, { createContext } from "react"

type StripeWrapperProps = {
  paymentSession?: HttpTypes.StorePaymentSession
  stripeKey?: string
  stripePromise: Promise<Stripe | null> | null
  children: React.ReactNode
}

export const StripeContext = createContext<boolean>(false)

const StripeWrapper: React.FC<StripeWrapperProps> = ({
  paymentSession,
  stripeKey,
  stripePromise,
  children,
}) => {
  const clientSecret = paymentSession?.data?.client_secret as string | undefined

  if (!stripeKey || !stripePromise || !clientSecret) {
    return (
      <StripeContext.Provider value={false}>
        {children}
      </StripeContext.Provider>
    )
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#111111",
        colorBackground: "#FFFFFF",
        colorText: "#111111",
        colorDanger: "#7A2E3A",
        fontFamily: "Inter, system-ui, sans-serif",
        borderRadius: "0px",
      },
    },
  }

  return (
    <StripeContext.Provider value={true}>
      <Elements options={options} stripe={stripePromise}>
        {children}
      </Elements>
    </StripeContext.Provider>
  )
}

export default StripeWrapper
