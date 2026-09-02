"use client"

import React, { useState } from "react"
import Link from "next/link"

interface FaqItem {
  question: string
  answer: string
}

const FAQS: FaqItem[] = [
  {
    question: "How does delivery work across Bangladesh?",
    answer:
      "We operate a dedicated fulfilment network from our Tejgaon, Dhaka warehouse. Standard delivery inside Dhaka takes 24-48 hours (৳60 flat fee). Dhaka suburban areas (Savar, Gazipur, Narayanganj) take 2-3 days (৳100). Nationwide delivery across all other districts takes 3-5 business days (৳130).",
  },
  {
    question: "What makes London Boy fabrics different?",
    answer:
      "Our signature tees use 240 GSM combed compact cotton, which is heavier and more structured than standard 160-180 GSM shirts. Our Oxford shirts are woven with two-ply yarns for crisp collar structure that requires minimal ironing.",
  },
  {
    question: "What is your return and exchange policy?",
    answer:
      "We offer a 24-hour inspection and exchange window upon parcel receipt. If a size does not fit as expected, contact our support team and we will schedule an exchange parcel directly to your address.",
  },
  {
    question: "Can I pay Cash on Delivery (COD)?",
    answer:
      "Yes. Cash on Delivery is available nationwide across all 64 districts in Bangladesh with zero surcharge.",
  },
  {
    question: "Is this website a live commercial store?",
    answer:
      "This particular site is an interactive portfolio demonstration operating completely within your browser's local storage. No real money or real-world shipment is executed from this demo instance.",
  },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="content-container py-16 max-w-3xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <span className="badge-tag bg-brand-secondary text-brand-accent">Knowledge Base</span>
        <h1 className="font-display text-4xl text-brand-primary">Frequently Asked Questions</h1>
        <p className="text-sm text-grey-60">Find quick answers about delivery, sizing, and London Boy fabrics.</p>
      </div>

      <div className="border border-brand-border bg-white divide-y divide-brand-border">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div key={idx} className="p-6">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left font-heading font-semibold text-sm text-brand-primary hover:text-brand-accent transition-colors"
              >
                <span>{faq.question}</span>
                <span className="text-lg text-grey-40 ml-4">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && <p className="text-xs text-grey-60 mt-3 leading-relaxed animate-enter">{faq.answer}</p>}
            </div>
          )
        })}
      </div>

      <div className="p-6 bg-brand-card border border-brand-border text-center space-y-3">
        <h3 className="font-heading font-semibold text-sm text-brand-primary">Still have questions?</h3>
        <p className="text-xs text-grey-60">Our customer care team is available 7 days a week.</p>
        <Link href="/contact" className="contrast-btn text-xs inline-block">
          Contact Concierge
        </Link>
      </div>
    </div>
  )
}
