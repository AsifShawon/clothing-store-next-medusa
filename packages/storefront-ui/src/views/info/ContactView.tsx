"use client"

import React, { useState } from "react"
import Link from "next/link"
import { StoreRoutes } from "@dtc/commerce-contracts"
import { EnvelopeIcon, MapPinIcon } from "../../components/icons"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { LinkComponent } from "../../types"

export interface ContactViewProps {
  routes: StoreRoutes
  onSubmitInquiry?: (data: {
    name: string
    email: string
    orderNumber?: string
    subject: string
    message: string
  }) => Promise<void> | void
  linkComponent?: LinkComponent
}

export function ContactView({
  routes,
  onSubmitInquiry,
  linkComponent: LinkComp = Link,
}: ContactViewProps) {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    subject: "Order Inquiry",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (onSubmitInquiry) {
      await onSubmitInquiry(formData)
    }
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-brand-secondary border-b border-brand-border py-12 sm:py-16">
        <div className="content-container max-w-4xl text-center space-y-3">
          <span className="text-xs font-heading font-semibold uppercase tracking-widest text-brand-accent">
            Customer Care &amp; Atelier
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-primary">
            Get in Touch with London Boy
          </h1>
          <p className="text-xs sm:text-sm text-brand-primary/70 max-w-xl mx-auto">
            Have questions about sizing, fabric weights, or delivery inside Dhaka? Our customer care team responds within 4 business hours.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="content-container max-w-5xl py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-brand-accent">
                Direct Channels
              </span>
              <h2 className="font-display text-2xl text-brand-primary">
                Atelier &amp; Support Office
              </h2>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                We are dedicated to providing seamless service for our Bangladesh clientele.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-brand-secondary/40 border border-brand-border space-y-1">
                <div className="flex items-center gap-1.5 font-heading font-bold uppercase tracking-wider text-brand-primary">
                  <EnvelopeIcon className="w-3.5 h-3.5" />
                  <span>Email Support</span>
                </div>
                <a
                  href="mailto:londonboy@mack.com.bd"
                  className="text-brand-accent font-semibold hover:underline"
                >
                  londonboy@mack.com.bd
                </a>
                <p className="text-brand-primary/60 text-[11px]">Average response: &lt; 4 hours</p>
              </div>

              <div className="p-4 bg-brand-secondary/40 border border-brand-border space-y-1">
                <div className="flex items-center gap-1.5 font-heading font-bold uppercase tracking-wider text-brand-primary">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  <span>Dhaka Atelier &amp; Dispatch</span>
                </div>
                <p className="text-brand-primary/80">Tejgaon Industrial Area, Dhaka, Bangladesh</p>
                <p className="text-brand-primary/60 text-[11px]">Central Warehouse &amp; Fulfillment</p>
              </div>

              <div className="p-4 bg-brand-secondary/40 border border-brand-border space-y-1">
                <span className="font-heading font-bold uppercase tracking-wider text-brand-primary block">
                  Operating Hours
                </span>
                <p className="text-brand-primary/80">Saturday – Thursday: 10:00 AM – 8:00 PM</p>
                <p className="text-brand-primary/60 text-[11px]">Friday: Closed for weekly dispatch</p>
              </div>
            </div>

            {/* Quick Policy Links */}
            <div className="pt-4 border-t border-brand-border/60 space-y-2">
              <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-brand-primary block">
                Quick Assistance
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <LinkComp
                  href={routes.shippingPolicy()}
                  className="px-3 py-1 bg-brand-secondary border border-brand-border text-brand-primary hover:border-brand-primary"
                >
                  Shipping Rates (৳60 / ৳100 / ৳130)
                </LinkComp>
                <LinkComp
                  href={routes.returnPolicy()}
                  className="px-3 py-1 bg-brand-secondary border border-brand-border text-brand-primary hover:border-brand-primary"
                >
                  24h Return Policy
                </LinkComp>
                <LinkComp
                  href={routes.faq()}
                  className="px-3 py-1 bg-brand-secondary border border-brand-border text-brand-primary hover:border-brand-primary"
                >
                  FAQ Knowledge Base
                </LinkComp>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-brand-card border border-brand-border p-6 sm:p-8">
            <h3 className="font-heading font-bold text-base uppercase tracking-wider text-brand-primary mb-6">
              Send a Message
            </h3>

            {submitted ? (
              <div className="p-8 bg-brand-secondary border border-brand-accent/40 text-center space-y-3" role="alert">
                <span className="text-3xl">✉️</span>
                <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-primary">
                  Thank You, {formData.name}
                </h4>
                <p className="text-xs text-brand-primary/70 max-w-sm mx-auto">
                  Your message has been logged. Our customer care representative will respond to{" "}
                  <span className="font-bold">{formData.email}</span> within 4 business hours.
                </p>
                <Button
                  type="button"
                  variant="primary"
                  size="small"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 uppercase tracking-wider text-xs"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Full Name *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Asif Shawon"
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., asif@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Order ID (Optional)"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="e.g., ord_01M..."
                  />

                  <div className="space-y-1">
                    <label className="font-heading font-bold text-xs uppercase tracking-wider text-brand-primary block">
                      Topic / Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-brand-border text-brand-primary focus:outline-none focus:border-brand-primary text-xs"
                    >
                      <option>Order &amp; Delivery Status</option>
                      <option>Size &amp; Fit Consultation</option>
                      <option>24h Return / Exchange Request</option>
                      <option>Fabric &amp; 240 GSM Inquiry</option>
                      <option>Other Question</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-heading font-bold text-xs uppercase tracking-wider text-brand-primary block">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about your question or order..."
                    className="w-full px-3.5 py-2.5 bg-white border border-brand-border text-brand-primary placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-primary text-xs"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  isLoading={isSubmitting}
                  className="w-full uppercase tracking-widest text-xs font-semibold"
                >
                  Submit Inquiry →
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
