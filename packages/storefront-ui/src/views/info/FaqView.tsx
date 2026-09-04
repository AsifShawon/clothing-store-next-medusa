"use client"

import React, { useState } from "react"
import Link from "next/link"
import { StoreRoutes } from "@dtc/commerce-contracts"
import { ChevronDownIcon, MagnifyingGlassIcon } from "../../components/icons"
import { LinkComponent } from "../../types"

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqCategory {
  category: string
  questions: FaqItem[]
}

export const DEFAULT_FAQ_DATA: FaqCategory[] = [
  {
    category: "Orders & Account",
    questions: [
      {
        question: "How do I place an order on London Boy?",
        answer:
          "Browse our curated catalog, select your desired size and color variant, and click 'Add to Bag'. Proceed to the checkout page where you can enter your delivery address and choose between Cash on Delivery (COD) or instant digital payment.",
      },
      {
        question: "Do I need to create an account to purchase?",
        answer:
          "No, you can check out as a guest. However, creating an account allows you to track real-time dispatch status, manage multiple delivery addresses, and view full order history.",
      },
      {
        question: "Can I modify or cancel my order after placing it?",
        answer:
          "Orders are processed rapidly in our Dhaka Central Warehouse. If you need to change your size or delivery address, please email londonboy@mack.com.bd within 1 hour of placing your order.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        question: "What are the delivery charges and timelines across Bangladesh?",
        answer:
          "Inside Dhaka City: ৳60 standard delivery (24–48 hours, free on orders above ৳2,000). Dhaka Suburban (Savar, Gazipur, Keraniganj): ৳100 (2–3 business days). Outside Dhaka (All 64 districts): ৳130 (3–5 business days).",
      },
      {
        question: "How can I track my package?",
        answer:
          "As soon as your order is dispatched from our Dhaka warehouse, you will receive an SMS and email notification with your live courier tracking link.",
      },
      {
        question: "Do you offer international shipping?",
        answer:
          "Currently, London Boy exclusively serves customers located in Bangladesh with express domestic delivery. International shipping will be announced in upcoming collections.",
      },
    ],
  },
  {
    category: "24-Hour Returns & Exchanges",
    questions: [
      {
        question: "What is the London Boy return window?",
        answer:
          "We offer a 24-hour return and size exchange guarantee from the moment of delivery handover. The item must be unworn, unwashed, with all original tags attached.",
      },
      {
        question: "How do I request a size exchange?",
        answer:
          "Email londonboy@mack.com.bd with your Order ID and photo of the tag within 24 hours. Our courier partner will collect the return garment from your doorstep and deliver the replacement size.",
      },
    ],
  },
  {
    category: "Fabric Quality & Care",
    questions: [
      {
        question: "What does 240 GSM combed compact cotton mean?",
        answer:
          "GSM stands for Grams per Square Meter, indicating the physical weight and density of the fabric. Standard commercial t-shirts use 140–160 GSM. London Boy uses 240 GSM combed compact cotton, giving our tees structured drape, zero transparency, and enduring collar resilience.",
      },
      {
        question: "How should I wash London Boy garments?",
        answer:
          "Machine wash cold (30°C or below) inside out with similar colors. Do not bleach or tumble dry on high heat. Warm iron on reverse side to protect embroidered insignias.",
      },
    ],
  },
  {
    category: "Payment Methods",
    questions: [
      {
        question: "Which payment options are supported?",
        answer:
          "We accept Cash on Delivery (COD) across all 64 districts of Bangladesh, as well as Visa, Mastercard, bKash, and Nagad.",
      },
    ],
  },
]

export interface FaqViewProps {
  faqData?: FaqCategory[]
  routes?: StoreRoutes
  contactHref?: string
  linkComponent?: LinkComponent
}

export function FaqView({
  faqData = DEFAULT_FAQ_DATA,
  routes,
  contactHref,
  linkComponent: LinkComp = Link,
}: FaqViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ "0-0": true })

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredCategories = faqData
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0)

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-brand-secondary border-b border-brand-border py-12 sm:py-16">
        <div className="content-container max-w-3xl text-center space-y-4">
          <span className="text-xs font-heading font-semibold uppercase tracking-widest text-brand-accent">
            Client Assistance Knowledge Base
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-primary">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-brand-primary/70 max-w-xl mx-auto">
            Find immediate answers regarding Dhaka express dispatch, size selections, 240 GSM fabrics, and our 24-hour return guarantee.
          </p>

          <div className="pt-2 max-w-md mx-auto relative">
            <MagnifyingGlassIcon className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search answers (e.g. shipping, return, 240 GSM)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border text-xs text-brand-primary focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* Main FAQ Accordions */}
      <div className="content-container max-w-3xl py-12 sm:py-16 space-y-10">
        {filteredCategories.length === 0 ? (
          <div className="py-12 text-center text-xs text-brand-muted">
            No questions found matching &quot;{searchQuery}&quot;. Please contact client care.
          </div>
        ) : (
          filteredCategories.map((cat, catIdx) => (
            <div key={cat.category} className="space-y-4">
              <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-primary border-b border-brand-border pb-2">
                {cat.category}
              </h2>

              <div className="divide-y divide-brand-border border border-brand-border bg-white">
                {cat.questions.map((item, qIdx) => {
                  const key = `${catIdx}-${qIdx}`
                  const isOpen = !!openItems[key]

                  return (
                    <div key={item.question}>
                      <button
                        type="button"
                        onClick={() => toggleItem(key)}
                        className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-brand-surface transition-colors"
                      >
                        <span className="font-heading font-semibold text-xs text-brand-primary">
                          {item.question}
                        </span>
                        <ChevronDownIcon
                          className={`w-4 h-4 text-brand-muted transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-brand-muted leading-relaxed">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}

        {/* Support Banner */}
        <div className="p-6 bg-brand-surface border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <div>
            <span className="font-heading font-bold text-brand-primary block">
              Still need personalized assistance?
            </span>
            <p className="text-[11px] mt-0.5">
              Our Dhaka client advisors respond within 4 business hours.
            </p>
          </div>
          <LinkComp
            href={contactHref || (routes ? routes.contact() : "/contact")}
            className="px-5 py-2.5 bg-brand-primary text-white font-heading font-semibold uppercase tracking-wider text-xs hover:bg-black transition-colors"
          >
            Contact Customer Support
          </LinkComp>
        </div>
      </div>
    </div>
  )
}
