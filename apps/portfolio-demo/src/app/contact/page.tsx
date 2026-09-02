"use client"

import React, { useState } from "react"
import { useDemo } from "@lib/demo-context"
import { MapPin, Phone, Envelope } from "@medusajs/icons"

export default function ContactPage() {
  const { showToast } = useDemo()
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSent(true)
    showToast("Message Received", "Our customer care concierge will respond shortly.", "success")
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="content-container py-16 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <span className="badge-tag bg-brand-secondary text-brand-accent">Concierge Care</span>
        <h1 className="font-display text-4xl text-brand-primary">Contact Support</h1>
        <p className="text-sm text-grey-60 max-w-md mx-auto">
          Reach our Dhaka team for sizing assistance, order status, or tailoring inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Col */}
        <div className="space-y-6">
          <div className="p-5 bg-brand-card border border-brand-border space-y-2">
            <MapPin className="w-5 h-5 text-brand-accent" />
            <h4 className="font-heading font-semibold text-xs text-brand-primary uppercase">Dhaka Headquarters</h4>
            <p className="text-xs text-grey-60 leading-relaxed">
              Tejgaon Industrial Area, Dhaka 1208, Bangladesh
            </p>
          </div>

          <div className="p-5 bg-brand-card border border-brand-border space-y-2">
            <Phone className="w-5 h-5 text-brand-accent" />
            <h4 className="font-heading font-semibold text-xs text-brand-primary uppercase">Phone & WhatsApp</h4>
            <p className="text-xs text-grey-60">+880 1712 345678 (10 AM - 8 PM BST)</p>
          </div>

          <div className="p-5 bg-brand-card border border-brand-border space-y-2">
            <Envelope className="w-5 h-5 text-brand-accent" />
            <h4 className="font-heading font-semibold text-xs text-brand-primary uppercase">Electronic Mail</h4>
            <p className="text-xs text-grey-60">care@londonboy.uk</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white border border-brand-border p-8">
          <h2 className="font-heading font-semibold text-lg text-brand-primary border-b border-brand-border pb-4 mb-6">
            Send an Inquiry
          </h2>

          {isSent && (
            <div className="p-4 mb-6 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
              Thank you! Your simulated inquiry has been submitted.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-grey-70 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-card text-brand-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-grey-70 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-card text-brand-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-grey-70 block mb-1">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Sizing query for Oxford Shirt"
                className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-card text-brand-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-grey-70 block mb-1">Message *</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How may our care team assist you today?"
                className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-card text-brand-primary focus:outline-none"
              />
            </div>

            <button type="submit" className="contrast-btn text-xs py-3">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
